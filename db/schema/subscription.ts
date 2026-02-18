// Stripe subscription state managed by the @better-auth/stripe plugin.
// referenceId is polymorphic: points to user.id or organization.id depending
// on whether the subscription is personal or org-level billing.

import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { generateAuthId } from "./id";

export const subscription = pgTable(
  "subscription",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateAuthId("subscription")),
    plan: text().notNull(),
    referenceId: text().notNull(),
    stripeCustomerId: text(),
    stripeSubscriptionId: text().unique(),
    status: text().default("incomplete").notNull(),
    periodStart: timestamp({ withTimezone: true, mode: "date" }),
    periodEnd: timestamp({ withTimezone: true, mode: "date" }),
    trialStart: timestamp({ withTimezone: true, mode: "date" }),
    trialEnd: timestamp({ withTimezone: true, mode: "date" }),
    cancelAtPeriodEnd: boolean().default(false),
    cancelAt: timestamp({ withTimezone: true, mode: "date" }),
    canceledAt: timestamp({ withTimezone: true, mode: "date" }),
    endedAt: timestamp({ withTimezone: true, mode: "date" }),
    seats: integer(),
    billingInterval: text(),
    groupId: text(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("subscription_reference_id_idx").on(table.referenceId),
    index("subscription_stripe_customer_id_idx").on(table.stripeCustomerId),
  ],
);

export type Subscription = typeof subscription.$inferSelect;
export type NewSubscription = typeof subscription.$inferInsert;
