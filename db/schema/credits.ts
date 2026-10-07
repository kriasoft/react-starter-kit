/**
 * Credits wallet: prepaid balance plus an append-only ledger.
 *
 * `credits_account` holds one row per user with the live balance; the balance
 * column is only ever mutated inside the wallet helpers in `apps/api/lib/wallet`
 * together with a matching ledger row, in the same transaction.
 *
 * `credits_transaction` is the fact source for auditing and reconciliation:
 * rows are inserted, never updated (except the `balanceAfter` snapshot written
 * by the same transaction that moves the balance). The `(type, refId)` unique
 * constraint is the idempotency anchor: webhooks and retries replay the same
 * ref and the insert simply loses, so credits are never applied twice.
 */

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { generateId } from "./id";
import { user } from "./user";

/** What moved credits. `refId` semantics per type:
 *  - signup_grant        → `signup:{userId}` (lazy, granted once per user)
 *  - subscription_grant  → Stripe invoice id
 *  - pack_purchase       → Stripe checkout session id / Creem event id
 *  - generation          → generation id being paid for
 *  - refund              → `refund:{generationId}` (failed generation)
 *  - admin_adjust        → operator-supplied reference
 */
export const CREDIT_TXN_TYPES = [
  "signup_grant",
  "subscription_grant",
  "pack_purchase",
  "generation",
  "refund",
  "admin_adjust",
] as const;

export type CreditTxnType = (typeof CREDIT_TXN_TYPES)[number];

export const creditsAccount = pgTable(
  "credits_account",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("wal")),
    userId: text()
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    balance: integer().default(0).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("credits_account_user_id_idx").on(table.userId)],
);

export type CreditsAccount = typeof creditsAccount.$inferSelect;
export type NewCreditsAccount = typeof creditsAccount.$inferInsert;

export const creditsTransaction = pgTable(
  "credits_transaction",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("trx")),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Positive = credited, negative = spent. */
    delta: integer().notNull(),
    type: text().$type<CreditTxnType>().notNull(),
    /** Idempotency anchor; meaning depends on `type` (see CREDIT_TXN_TYPES). */
    refId: text().notNull(),
    /** Balance after this entry; written by the same transaction as the move. */
    balanceAfter: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("credits_txn_type_ref_unique").on(table.type, table.refId),
    index("credits_txn_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export type CreditsTransaction = typeof creditsTransaction.$inferSelect;
export type NewCreditsTransaction = typeof creditsTransaction.$inferInsert;

export const creditsAccountRelations = relations(creditsAccount, ({ one }) => ({
  user: one(user, {
    fields: [creditsAccount.userId],
    references: [user.id],
  }),
}));

export const creditsTransactionRelations = relations(
  creditsTransaction,
  ({ one }) => ({
    user: one(user, {
      fields: [creditsTransaction.userId],
      references: [user.id],
    }),
  }),
);
