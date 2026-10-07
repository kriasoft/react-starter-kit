/**
 * Credits wallet operations.
 *
 * Every balance move happens inside one database transaction and produces
 * exactly one append-only ledger row. Guarantees:
 *
 *  - Idempotency: `(type, refId)` is unique. Replaying an already-applied
 *    credit is a no-op (`applied: false`); replaying a debit aborts its
 *    transaction (throwing `WalletAlreadyAppliedError`), so the speculative
 *    balance update rolls back and money is never moved twice.
 *  - No overdraft: debits use a conditional update (`balance >= amount`),
 *    so concurrent spenders cannot drive the balance negative.
 *  - Refunds are credits with `type: "refund"` and their own ref; a refund
 *    of the same generation twice is a no-op by the same anchor.
 */

import {
  creditsAccount,
  creditsTransaction,
  type CreditTxnType,
  type CreditsAccount,
  type Database,
} from "@repo/db";
import { and, eq, gte, sql } from "drizzle-orm";

/** Credits granted once, lazily, the first time a user touches the wallet. */
export const SIGNUP_GRANT_CREDITS = 10;

/** Thrown when a debit cannot move because the balance is too low. */
export class InsufficientCreditsError extends Error {
  constructor(
    readonly balance: number,
    readonly amount: number,
  ) {
    super(`Insufficient credits: have ${balance}, need ${amount}`);
    this.name = "InsufficientCreditsError";
  }
}

/** Thrown when a debit's (type, refId) was already applied before. */
export class WalletAlreadyAppliedError extends Error {
  constructor(readonly refId: string) {
    super(`Wallet entry already applied for ref ${refId}`);
    this.name = "WalletAlreadyAppliedError";
  }
}

export type WalletResult = {
  applied: boolean;
  balance: number;
  transactionId: string | null;
};

/** The user's account row, created on first touch. Never returns null. */
export async function ensureWallet(
  db: Database,
  userId: string,
): Promise<CreditsAccount> {
  await db.insert(creditsAccount).values({ userId }).onConflictDoNothing();
  const [account] = await db
    .select()
    .from(creditsAccount)
    .where(eq(creditsAccount.userId, userId));
  return account;
}

/**
 * Add credits (positive delta). Idempotent per (type, refId): the first call
 * moves the balance and writes the ledger row; replays return the current
 * balance with `applied: false` and change nothing.
 */
export async function creditWallet(
  db: Database,
  params: {
    userId: string;
    /** Must be positive; enforce at call sites. */
    amount: number;
    type: Extract<
      CreditTxnType,
      | "signup_grant"
      | "subscription_grant"
      | "pack_purchase"
      | "refund"
      | "admin_adjust"
    >;
    refId: string;
  },
): Promise<WalletResult> {
  if (params.amount <= 0) throw new Error("credit amount must be positive");

  return db.transaction(async (tx) => {
    await tx
      .insert(creditsAccount)
      .values({ userId: params.userId })
      .onConflictDoNothing();

    const inserted = await tx
      .insert(creditsTransaction)
      .values({
        userId: params.userId,
        delta: params.amount,
        type: params.type,
        refId: params.refId,
        // Snapshot filled after the balance update below, same transaction.
        balanceAfter: 0,
      })
      .onConflictDoNothing({
        target: [creditsTransaction.type, creditsTransaction.refId],
      })
      .returning({ id: creditsTransaction.id });

    const [insertedTxn] = inserted;
    if (!insertedTxn) {
      const [current] = await tx
        .select({ balance: creditsAccount.balance })
        .from(creditsAccount)
        .where(eq(creditsAccount.userId, params.userId));
      return {
        applied: false,
        balance: current?.balance ?? 0,
        transactionId: null,
      };
    }

    const [account] = await tx
      .update(creditsAccount)
      .set({ balance: sql`${creditsAccount.balance} + ${params.amount}` })
      .where(eq(creditsAccount.userId, params.userId))
      .returning();

    await tx
      .update(creditsTransaction)
      .set({ balanceAfter: account.balance })
      .where(eq(creditsTransaction.id, insertedTxn.id));

    return {
      applied: true,
      balance: account.balance,
      transactionId: insertedTxn.id,
    };
  });
}

/**
 * Spend credits (debit). The conditional update makes the check-and-move
 * atomic, so two concurrent spends of a 1-credit balance cannot both win.
 *
 * A replay of an already-applied (type, refId) throws
 * `WalletAlreadyAppliedError` AFTER the speculative update, which rolls the
 * whole transaction back — net zero on the ledger and the balance.
 */
export async function debitWallet(
  db: Database,
  params: {
    userId: string;
    amount: number;
    type: Extract<CreditTxnType, "generation">;
    refId: string;
  },
): Promise<WalletResult> {
  if (params.amount <= 0) throw new Error("debit amount must be positive");

  return db.transaction(async (tx) => {
    const [account] = await tx
      .update(creditsAccount)
      .set({ balance: sql`${creditsAccount.balance} - ${params.amount}` })
      .where(
        and(
          eq(creditsAccount.userId, params.userId),
          gte(creditsAccount.balance, params.amount),
        ),
      )
      .returning();

    if (!account) {
      const [current] = await tx
        .select({ balance: creditsAccount.balance })
        .from(creditsAccount)
        .where(eq(creditsAccount.userId, params.userId));
      throw new InsufficientCreditsError(current?.balance ?? 0, params.amount);
    }

    const [insertedTxn] = await tx
      .insert(creditsTransaction)
      .values({
        userId: params.userId,
        delta: -params.amount,
        type: params.type,
        refId: params.refId,
        balanceAfter: account.balance,
      })
      .onConflictDoNothing({
        target: [creditsTransaction.type, creditsTransaction.refId],
      })
      .returning({ id: creditsTransaction.id });

    if (!insertedTxn) {
      // Speculative debit of an already-charged ref: abort so the update above
      // rolls back with the transaction.
      throw new WalletAlreadyAppliedError(params.refId);
    }

    return {
      applied: true,
      balance: account.balance,
      transactionId: insertedTxn.id,
    };
  });
}

/** Refund a generation: a credit keyed by its own anchor, replay-safe. */
export function refundGeneration(
  db: Database,
  params: { userId: string; amount: number; generationId: string },
): Promise<WalletResult> {
  return creditWallet(db, {
    userId: params.userId,
    amount: params.amount,
    type: "refund",
    refId: `refund:${params.generationId}`,
  });
}

/** Lazy one-time signup grant; safe to call on every wallet touch. */
export function ensureSignupGrant(
  db: Database,
  userId: string,
): Promise<WalletResult> {
  return creditWallet(db, {
    userId,
    amount: SIGNUP_GRANT_CREDITS,
    type: "signup_grant",
    refId: `signup:${userId}`,
  });
}
