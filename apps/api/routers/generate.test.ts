import { creditsAccount, generation, user } from "@repo/db";
import { createTestDatabase } from "@repo/db/testing";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { afterEach, describe, expect, it, vi } from "vitest";
import { afterAll, beforeEach } from "vitest";

import type { TRPCContext } from "../lib/context";
import { createCallerFactory } from "../lib/trpc";
import { debitWallet } from "../lib/wallet";
import { generateRouter } from "./generate";
import { historyRouter } from "./history";

const createCaller = createCallerFactory(generateRouter);
const createHistoryCaller = createCallerFactory(historyRouter);

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

const PNG_BASE64 = Buffer.from("fake-png-bytes").toString("base64");

/** In-memory KV double for the rate limiter. */
function mockKv() {
  const store = new Map<string, string>();
  return {
    get: async (key: string) => store.get(key) ?? null,
    put: async (key: string, value: string) => void store.set(key, value),
  };
}

type EnvOverrides = {
  turnstileSecret?: string;
  aiFails?: boolean;
  r2Fails?: boolean;
};

function testEnv(overrides: EnvOverrides = {}) {
  const kv = mockKv();
  const r2Keys: string[] = [];

  const env = {
    AI: {
      run: vi.fn(async () =>
        overrides.aiFails
          ? Promise.reject(new Error("model exploded"))
          : Promise.resolve({ image: PNG_BASE64 }),
      ),
    },
    IMAGES: {
      put: vi.fn(async (key: string) => {
        if (overrides.r2Fails) throw new Error("r2 exploded");
        r2Keys.push(key);
      }),
    },
    RATELIMIT: kv,
    ...(overrides.turnstileSecret
      ? { TURNSTILE_SECRET_KEY: overrides.turnstileSecret }
      : {}),
  } as unknown as TRPCContext["env"];

  return { env, r2Keys };
}

function testCtx(userId: string, env: TRPCContext["env"]): TRPCContext {
  return {
    req: new Request("http://localhost"),
    info: {} as TRPCContext["info"],
    session: {
      id: "ses_test",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
      expiresAt: new Date(Date.now() + 60_000),
      token: "token",
      activeOrganizationId: null,
    },
    user: {
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "test@example.com",
      emailVerified: true,
      name: "Test User",
    },
    db,
    dbCached: db,
    env,
  };
}

async function insertUser(email = "gen@example.com") {
  const rows = await db
    .insert(user)
    .values({ name: "Gen User", email, emailVerified: true })
    .returning();
  return rows[0].id;
}

async function balanceOf(userId: string) {
  const rows = await db
    .select({ balance: creditsAccount.balance })
    .from(creditsAccount)
    .where(eq(creditsAccount.userId, userId));
  return rows[0]?.balance ?? 0;
}

function prompt(overrides: Record<string, unknown> = {}) {
  return { prompt: "a red panda barista", steps: 4, ...overrides };
}

function trpcCode(error: unknown) {
  if (error instanceof TRPCError) return error.code;
  throw error;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("generate success path", () => {
  it("debits, generates, stores, and reports the new balance", async () => {
    const userId = await insertUser();
    const { env, r2Keys } = testEnv();
    const caller = createCaller(testCtx(userId, env));

    const result = await caller.generate(prompt());

    expect(result.status).toBe("succeeded");
    expect(result.cost).toBe(1);
    expect(result.balance).toBe(9); // 10 signup - 1
    expect(result.imageKey).toMatch(new RegExp("^" + userId + "/.+\\.png$"));
    expect(r2Keys).toEqual([result.imageKey]);
    expect(await balanceOf(userId)).toBe(9);
  });

  it("charges double for high-step generations", async () => {
    const userId = await insertUser();
    const caller = createCaller(testCtx(userId, testEnv().env));

    const result = await caller.generate(prompt({ steps: 8 }));

    expect(result.cost).toBe(2);
    expect(result.balance).toBe(8);
  });
});

describe("generate failure rollback", () => {
  it("refunds and marks failed when the model errors", async () => {
    const userId = await insertUser();
    const caller = createCaller(
      testCtx(userId, testEnv({ aiFails: true }).env),
    );

    await expect(caller.generate(prompt())).rejects.toThrow(
      /generation failed, credits refunded/i,
    );

    const rows = await db
      .select()
      .from(generation)
      .where(eq(generation.userId, userId));
    expect(rows[0].status).toBe("failed");
    expect(rows[0].errorKind).toBe("model_unavailable");
    // Debit and refund cancel out; only the signup grant remains.
    expect(await balanceOf(userId)).toBe(10);
  });

  it("refunds and marks failed when R2 errors", async () => {
    const userId = await insertUser();
    const caller = createCaller(
      testCtx(userId, testEnv({ r2Fails: true }).env),
    );

    await expect(caller.generate(prompt())).rejects.toThrow(
      /storage failed, credits refunded/i,
    );

    const rows = await db
      .select()
      .from(generation)
      .where(eq(generation.userId, userId));
    expect(rows[0].errorKind).toBe("storage_failed");
    expect(await balanceOf(userId)).toBe(10);
  });

  it("rejects with PAYMENT_REQUIRED when the wallet is empty", async () => {
    const userId = await insertUser();
    const { env } = testEnv();

    // Drain the signup grant first.
    await createCaller(testCtx(userId, env)).generate(prompt());
    await debitWallet(db, {
      userId,
      amount: 9,
      type: "generation",
      refId: "manual_drain",
    });

    const error = await createCaller(testCtx(userId, env))
      .generate(prompt())
      .catch((e: unknown) => e);

    expect(trpcCode(error)).toBe("PAYMENT_REQUIRED");
    expect(await balanceOf(userId)).toBe(0);
  });
});

describe("generate idempotency", () => {
  it("replays the original outcome without a second charge", async () => {
    const userId = await insertUser();
    const { env } = testEnv();
    const caller = createCaller(testCtx(userId, env));
    const key = "retry-key-123";

    const first = await caller.generate(prompt({ idempotencyKey: key }));
    const second = await caller.generate(prompt({ idempotencyKey: key }));

    expect(second.id).toBe(first.id);
    expect(second.status).toBe("succeeded");
    expect(await balanceOf(userId)).toBe(9);
    expect(env.AI!.run).toHaveBeenCalledTimes(1);
  });
});

describe("generate guardrails", () => {
  it("rejects blocked prompts without creating rows or charges", async () => {
    const userId = await insertUser();
    const caller = createCaller(testCtx(userId, testEnv().env));

    const error = await caller
      .generate(prompt({ prompt: "csam please" }))
      .catch((e: unknown) => e);

    expect(trpcCode(error)).toBe("BAD_REQUEST");
    const rows = await db
      .select()
      .from(generation)
      .where(eq(generation.userId, userId));
    expect(rows.length).toBe(0);
    // The blocklist fires before the signup grant, so no wallet row exists
    // yet: balanceOf reads as 0, not 10.
    expect(await balanceOf(userId)).toBe(0);
  });

  it("rejects invalid steps and oversized prompts at the schema layer", async () => {
    const userId = await insertUser();
    const caller = createCaller(testCtx(userId, testEnv().env));

    await expect(caller.generate(prompt({ steps: 9 }))).rejects.toThrow();
    await expect(
      caller.generate(prompt({ prompt: "x".repeat(2049) })),
    ).rejects.toThrow();
  });

  it("rate-limits the 7th attempt in a window", async () => {
    const userId = await insertUser();
    const caller = createCaller(testCtx(userId, testEnv().env));

    for (let attempt = 0; attempt < 6; attempt++) {
      await caller.generate(prompt({ prompt: `cat ${attempt}` }));
    }

    const error = await caller
      .generate(prompt({ prompt: "one too many" }))
      .catch((e: unknown) => e);

    expect(trpcCode(error)).toBe("TOO_MANY_REQUESTS");
    // Six succeeded: 10 - 6 = 4.
    expect(await balanceOf(userId)).toBe(4);
  });

  it("fails closed on Turnstile when a secret is configured", async () => {
    const userId = await insertUser();
    const { env } = testEnv({
      turnstileSecret: "1x0000000000000000000000000000000AA",
    });

    const missingToken = await createCaller(testCtx(userId, env))
      .generate(prompt())
      .catch((e: unknown) => e);
    expect(trpcCode(missingToken)).toBe("BAD_REQUEST");

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: false }), { status: 200 }),
      ),
    );

    const badToken = await createCaller(testCtx(userId, env))
      .generate(prompt({ turnstileToken: "invalid" }))
      .catch((e: unknown) => e);
    expect(trpcCode(badToken)).toBe("BAD_REQUEST");

    const rows = await db
      .select()
      .from(generation)
      .where(eq(generation.userId, userId));
    expect(rows.length).toBe(0);
  });

  it("passes with a verified Turnstile token", async () => {
    const userId = await insertUser();
    const { env } = testEnv({
      turnstileSecret: "1x0000000000000000000000000000000AA",
    });

    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ success: true }), { status: 200 }),
      ),
    );

    const result = await createCaller(testCtx(userId, env)).generate(
      prompt({ turnstileToken: "valid" }),
    );
    expect(result.status).toBe("succeeded");
  });

  it("reports unavailable when AI or R2 bindings are missing", async () => {
    const userId = await insertUser();
    const env = {} as TRPCContext["env"];

    const error = await createCaller(testCtx(userId, env))
      .generate(prompt())
      .catch((e: unknown) => e);

    expect(trpcCode(error)).toBe("SERVICE_UNAVAILABLE");
  });
});

describe("history router", () => {
  it("lists my generations and isolates other users' rows", async () => {
    const userA = await insertUser("a@example.com");
    const userB = await insertUser("b@example.com");
    const callerA = createCaller(testCtx(userA, testEnv().env));
    const historyA = createHistoryCaller(testCtx(userA, testEnv().env));
    const historyB = createHistoryCaller(testCtx(userB, testEnv().env));

    const created = await callerA.generate(prompt());

    const mine = await historyA.list();
    expect(mine.length).toBe(1);
    expect(mine[0].id).toBe(created.id);

    const theirs = await historyB.list();
    expect(theirs.length).toBe(0);

    await expect(historyB.get({ id: created.id })).rejects.toThrow(
      /not found/i,
    );
    const found = await historyA.get({ id: created.id });
    expect(found.id).toBe(created.id);
  });
});
