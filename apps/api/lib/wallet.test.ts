import { creditsAccount, creditsTransaction, user } from "@repo/db";
import { createTestDatabase } from "@repo/db/testing";
import { eq } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  creditWallet,
  debitWallet,
  ensureSignupGrant,
  InsufficientCreditsError,
  refundGeneration,
  WalletAlreadyAppliedError,
} from "./wallet";

const { db, reset, close } = await createTestDatabase();

afterAll(close);
beforeEach(reset);

async function insertUser(email = "wallet@example.com") {
  const rows = await db
    .insert(user)
    .values({ name: "Wallet User", email, emailVerified: true })
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

async function ledgerOf(userId: string) {
  return db
    .select()
    .from(creditsTransaction)
    .where(eq(creditsTransaction.userId, userId));
}

describe("signup grant", () => {
  it("grants once and replays are no-ops", async () => {
    const userId = await insertUser();

    const first = await ensureSignupGrant(db, userId);
    const second = await ensureSignupGrant(db, userId);

    expect(first.applied).toBe(true);
    expect(second.applied).toBe(false);
    expect(await balanceOf(userId)).toBe(10);
    expect((await ledgerOf(userId)).length).toBe(1);
  });
});

describe("creditWallet", () => {
  it("applies a purchase once and snapshots the balance", async () => {
    const userId = await insertUser();

    const first = await creditWallet(db, {
      userId,
      amount: 500,
      type: "pack_purchase",
      refId: "cs_test_123",
    });
    const replay = await creditWallet(db, {
      userId,
      amount: 500,
      type: "pack_purchase",
      refId: "cs_test_123",
    });

    expect(first.applied).toBe(true);
    expect(replay.applied).toBe(false);
    expect(await balanceOf(userId)).toBe(500);

    const ledger = await ledgerOf(userId);
    expect(ledger.length).toBe(1);
    expect(ledger[0].balanceAfter).toBe(500);
  });
});

describe("debitWallet", () => {
  it("debits when the balance covers it", async () => {
    const userId = await insertUser();
    await creditWallet(db, {
      userId,
      amount: 5,
      type: "pack_purchase",
      refId: "topup",
    });

    const debit = await debitWallet(db, {
      userId,
      amount: 3,
      type: "generation",
      refId: "gen_1",
    });

    expect(debit).toMatchObject({ applied: true, balance: 2 });
    expect(await balanceOf(userId)).toBe(2);
  });

  it("rejects an overdraft and writes no ledger row", async () => {
    const userId = await insertUser();
    await creditWallet(db, {
      userId,
      amount: 1,
      type: "pack_purchase",
      refId: "topup",
    });

    await expect(
      debitWallet(db, {
        userId,
        amount: 2,
        type: "generation",
        refId: "gen_1",
      }),
    ).rejects.toBeInstanceOf(InsufficientCreditsError);

    expect(await balanceOf(userId)).toBe(1);
    // Only the top-up row: the failed debit leaves no trace.
    expect((await ledgerOf(userId)).length).toBe(1);
  });

  it("lets exactly one of two concurrent debits win a 1-credit balance", async () => {
    const userId = await insertUser();
    await creditWallet(db, {
      userId,
      amount: 1,
      type: "pack_purchase",
      refId: "topup",
    });

    const results = await Promise.allSettled([
      debitWallet(db, {
        userId,
        amount: 1,
        type: "generation",
        refId: "gen_a",
      }),
      debitWallet(db, {
        userId,
        amount: 1,
        type: "generation",
        refId: "gen_b",
      }),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
    expect(
      rejected[0].status === "rejected" &&
        rejected[0].reason instanceof InsufficientCreditsError,
    ).toBe(true);
    expect(await balanceOf(userId)).toBe(0);
    expect((await ledgerOf(userId)).length).toBe(2); // top-up + one debit
  });

  it("aborts a replayed debit so the speculative update rolls back", async () => {
    const userId = await insertUser();
    await creditWallet(db, {
      userId,
      amount: 5,
      type: "pack_purchase",
      refId: "topup",
    });

    await debitWallet(db, {
      userId,
      amount: 1,
      type: "generation",
      refId: "gen_replay",
    });
    await expect(
      debitWallet(db, {
        userId,
        amount: 1,
        type: "generation",
        refId: "gen_replay",
      }),
    ).rejects.toBeInstanceOf(WalletAlreadyAppliedError);

    // Balance unchanged by the rejected replay: 5 - 1 = 4.
    expect(await balanceOf(userId)).toBe(4);
  });
});

describe("refundGeneration", () => {
  it("restores the spend exactly once", async () => {
    const userId = await insertUser();
    await creditWallet(db, {
      userId,
      amount: 5,
      type: "pack_purchase",
      refId: "topup",
    });
    await debitWallet(db, {
      userId,
      amount: 2,
      type: "generation",
      refId: "gen_x",
    });

    const first = await refundGeneration(db, {
      userId,
      amount: 2,
      generationId: "gen_x",
    });
    const replay = await refundGeneration(db, {
      userId,
      amount: 2,
      generationId: "gen_x",
    });

    expect(first.applied).toBe(true);
    expect(replay.applied).toBe(false);
    expect(await balanceOf(userId)).toBe(5);
  });
});
