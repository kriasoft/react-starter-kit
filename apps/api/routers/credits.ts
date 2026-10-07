/**
 * Credits queries: current balance (with the lazy signup grant) and the
 * spend/top-up history. Mutations live in `generate` (spend) and billing
 * webhooks (top-up) – the client never writes the wallet directly.
 */

import { creditsTransaction, type Database } from "@repo/db";
import { desc, eq } from "drizzle-orm";

import { protectedProcedure, router } from "../lib/trpc.js";
import { ensureSignupGrant, ensureWallet } from "../lib/wallet.js";

export const creditsRouter = router({
  balance: protectedProcedure.query(async ({ ctx }) => {
    await ensureSignupGrant(ctx.db, ctx.user.id);
    const account = await ensureWallet(ctx.db, ctx.user.id);
    return { balance: account.balance };
  }),

  transactions: protectedProcedure.query(async ({ ctx }) => {
    return selectRecentTransactions(ctx.db, ctx.user.id);
  }),
});

async function selectRecentTransactions(db: Database, userId: string) {
  return db
    .select({
      id: creditsTransaction.id,
      delta: creditsTransaction.delta,
      type: creditsTransaction.type,
      refId: creditsTransaction.refId,
      balanceAfter: creditsTransaction.balanceAfter,
      createdAt: creditsTransaction.createdAt,
    })
    .from(creditsTransaction)
    .where(eq(creditsTransaction.userId, userId))
    .orderBy(desc(creditsTransaction.createdAt))
    .limit(50);
}

export type CreditsRouter = typeof creditsRouter;
