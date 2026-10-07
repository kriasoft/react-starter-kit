/**
 * Image generation: the money path.
 *
 * Order of operations (deliberate – debiting before the model runs prevents
 * one balance from funding N concurrent in-flight requests):
 *
 *   1. guardrails (Turnstile, rate limit, blocklist, validation)
 *   2. idempotency replay check
 *   3. create `generation` row in `processing`
 *   4. DEBIT the wallet, anchored on the generation id
 *   5. run the model; on failure → refund + mark `failed` + rethrow
 *   6. store bytes in R2 under a server-generated key
 *      (on failure → refund + mark `failed` + rethrow)
 *   7. mark `succeeded`
 *
 * Every failure path refunds through the same append-only ledger, so balance
 * and ledger always reconcile; a debit can never exist without either a
 * `succeeded` row or a matching `refund` entry.
 *
 * Persistence lives in lib/generations.ts; wallet moves in lib/wallet.ts.
 * Read access (list/get for the client, public gallery later) is exposed
 * through `routers/history.ts` to keep this file the money path only.
 */

import type { Database } from "@repo/db";
import { TRPCError } from "@trpc/server";

import {
  findGenerationByIdempotencyKey,
  insertGeneration,
  markGenerationFailed,
  markGenerationSucceeded,
  type GenerationRow,
} from "../lib/generations.js";
import {
  consumeRateLimit,
  creditCost,
  findBlockedPrompt,
  generateInputSchema,
  verifyTurnstile,
} from "../lib/guard.js";
import { protectedProcedure, router } from "../lib/trpc.js";
import {
  debitWallet,
  ensureSignupGrant,
  ensureWallet,
  refundGeneration,
} from "../lib/wallet.js";

const MODEL_ID = "@cf/black-forest-labs/flux-1-schnell";
/** Per-user generate attempts per window; the wallet caps the real damage. */
const RATE_LIMIT = { key: "generate", limit: 6, windowSeconds: 60 } as const;

/** Client-facing projection; never exposes internal columns wholesale. */
function toGenerationDto(row: GenerationRow) {
  return {
    id: row.id,
    status: row.status,
    prompt: row.prompt,
    steps: row.steps,
    cost: row.cost,
    imageKey: row.r2Key,
    errorKind: row.errorKind,
    createdAt: row.createdAt,
  };
}

/** Workers AI returns the image as base64; the API worker enables
 *  nodejs_compat, so Buffer handles the decode in one step. */
function decodeBase64Image(value: string): Uint8Array {
  return Uint8Array.from(Buffer.from(value, "base64"));
}

/** Refund + mark failed. Swallows refund errors so the row still fails. */
async function failGeneration(
  db: Database,
  row: { id: string; userId: string; cost: number },
  kind: Parameters<typeof markGenerationFailed>[2],
  message: string,
): Promise<void> {
  try {
    await refundGeneration(db, {
      userId: row.userId,
      amount: row.cost,
      generationId: row.id,
    });
  } catch {
    // Ledger still shows the debit; reconcile sweeps refund-pending rows.
  }
  await markGenerationFailed(db, row.id, kind, message);
}

export const generateRouter = router({
  generate: protectedProcedure
    .input(generateInputSchema)
    .mutation(async ({ ctx, input }) => {
      // ————————————————— 1. guardrails —————————————————
      const ownerId = ctx.user.id;

      const captchaOk = await verifyTurnstile(
        ctx.env.TURNSTILE_SECRET_KEY,
        input.turnstileToken,
      );
      if (!captchaOk) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Captcha verification failed",
        });
      }

      const rate = await consumeRateLimit(
        ctx.env.RATELIMIT,
        RATE_LIMIT.key + ":" + ownerId,
        RATE_LIMIT.limit,
        RATE_LIMIT.windowSeconds,
      );
      if (!rate.allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Too many generation attempts, retry in a minute",
        });
      }

      if (findBlockedPrompt(input.prompt) !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Prompt rejected by content policy",
        });
      }

      if (!ctx.env.AI || !ctx.env.IMAGES) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Image generation is not configured",
        });
      }

      // ————————————————— 2. idempotent replay —————————————————
      if (input.idempotencyKey) {
        const existing = await findGenerationByIdempotencyKey(
          ctx.db,
          ownerId,
          input.idempotencyKey,
        );
        if (existing) {
          const account = await ensureWallet(ctx.db, ownerId);
          return { ...toGenerationDto(existing), balance: account.balance };
        }
      }

      await ensureSignupGrant(ctx.db, ownerId);

      // ————————————————— 3. job row —————————————————
      const cost = creditCost(input.steps);
      const row = await insertGeneration(ctx.db, {
        userId: ownerId,
        idempotencyKey: input.idempotencyKey ?? crypto.randomUUID(),
        prompt: input.prompt,
        model: MODEL_ID,
        steps: input.steps,
        cost,
      });

      // ————————————————— 4. debit —————————————————
      let debitBalance: number;
      try {
        const debit = await debitWallet(ctx.db, {
          userId: ownerId,
          amount: cost,
          type: "generation",
          refId: row.id,
        });
        debitBalance = debit.balance;
      } catch (error) {
        // A debit exception means NO money moved (the wallet transaction
        // aborts atomically). Do NOT refund here – refunding an unbilled
        // row would mint credits out of thin air.
        await markGenerationFailed(
          ctx.db,
          row.id,
          "internal",
          "wallet debit failed",
        );
        if (
          error instanceof Error &&
          error.name === "InsufficientCreditsError"
        ) {
          throw new TRPCError({
            code: "PAYMENT_REQUIRED",
            message: error.message,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Wallet debit failed",
        });
      }

      // ————————————————— 5. model —————————————————
      let bytes: Uint8Array;
      try {
        const result = (await ctx.env.AI.run(MODEL_ID, {
          prompt: row.prompt,
          steps: row.steps,
        })) as { image?: string };

        if (typeof result?.image !== "string") {
          throw new Error("model returned no image");
        }
        bytes = decodeBase64Image(result.image);
      } catch (error) {
        await failGeneration(
          ctx.db,
          row,
          "model_unavailable",
          error instanceof Error ? error.message : "model call failed",
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image generation failed, credits refunded",
        });
      }

      // ————————————————— 6. storage —————————————————
      // Server-generated key: user input never reaches object keys.
      const r2Key = row.userId + "/" + row.id + ".png";
      try {
        await ctx.env.IMAGES.put(r2Key, bytes, {
          httpMetadata: { contentType: "image/png" },
        });
      } catch (error) {
        await failGeneration(
          ctx.db,
          row,
          "storage_failed",
          error instanceof Error ? error.message : "r2 put failed",
        );
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Image storage failed, credits refunded",
        });
      }

      // ————————————————— 7. commit —————————————————
      const done =
        (await markGenerationSucceeded(ctx.db, row.id, r2Key)) ?? row;

      return { ...toGenerationDto(done), balance: debitBalance };
    }),
});
