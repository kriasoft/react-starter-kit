/**
 * Image generation job records: one row per paid generation attempt.
 *
 * The status column is a small state machine (see GENERATION_STATUS and
 * GENERATION_TRANSITIONS). Credits are debited before the model runs and
 * refunded automatically when a terminal `failed` state is reached, so a
 * `succeeded` row always corresponds to exactly one non-refunded `generation`
 * ledger entry, and a `failed` row to a `generation` + `refund` pair.
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

/**
 * Generation lifecycle:
 *
 *   processing ──▶ succeeded
 *        │
 *        └───────▶ failed   (credits auto-refunded)
 *
 * `processing` is short-lived (the row is created and finished within one
 * request). A row stuck in `processing` after a worker crash is swept as
 * `failed` with a matching refund by reconcile; clients must treat it as
 * pending, never as success.
 */
export const GENERATION_STATUS = ["processing", "succeeded", "failed"] as const;

export type GenerationStatus = (typeof GENERATION_STATUS)[number];

/** Allowed transitions; the updater is responsible for refunding on → failed. */
export const GENERATION_TRANSITIONS: Record<
  GenerationStatus,
  readonly GenerationStatus[]
> = {
  processing: ["succeeded", "failed"],
  succeeded: [],
  failed: [],
};

/** Generation error kinds stored in `errorKind` for triage. */
export const GENERATION_ERROR_KINDS = [
  "model_unavailable",
  "model_rejected",
  "storage_failed",
  "refund_pending",
  "internal",
] as const;

export type GenerationErrorKind = (typeof GENERATION_ERROR_KINDS)[number];

export const generation = pgTable(
  "generation",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("gen")),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /**
     * Client-supplied retry key: a network retry of the same request replays
     * the same key and receives the original outcome instead of a second
     * charge. Unique per user, so key collisions across users are harmless.
     */
    idempotencyKey: text().notNull(),
    status: text().$type<GenerationStatus>().default("processing").notNull(),
    prompt: text().notNull(),
    /** Model identifier as passed to the AI binding, e.g. flux-1-schnell. */
    model: text().notNull(),
    /** Diffusion steps; more steps cost more credits (see router pricing). */
    steps: integer().notNull(),
    /** Credits charged; mirrored in the matching ledger entry. */
    cost: integer().notNull(),
    /** R2 object key, set on success. User input never reaches key material. */
    r2Key: text(),
    errorKind: text().$type<GenerationErrorKind>(),
    errorMessage: text(),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("generation_idempotency_key_unique").on(
      table.userId,
      table.idempotencyKey,
    ),
    index("generation_user_created_idx").on(table.userId, table.createdAt),
    index("generation_status_idx").on(table.status),
  ],
);

export type Generation = typeof generation.$inferSelect;
export type NewGeneration = typeof generation.$inferInsert;

export const generationRelations = relations(generation, ({ one }) => ({
  user: one(user, {
    fields: [generation.userId],
    references: [user.id],
  }),
}));
