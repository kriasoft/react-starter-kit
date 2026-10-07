/**
 * Generation persistence. All access to the `generation` table lives here so
 * routers stay orchestration-only and future surfaces (public gallery,
 * reconcile sweep) reuse the same queries.
 *
 * Filters are always parameterized drizzle predicates over plain parameters;
 * callers pass server-derived ids.
 */

import { generation, type Database } from "@repo/db";
import { and, desc, eq } from "drizzle-orm";

export type GenerationRow = typeof generation.$inferSelect;
export type NewGenerationRow = typeof generation.$inferInsert;

export async function insertGeneration(
  db: Database,
  values: NewGenerationRow,
): Promise<GenerationRow> {
  const rows = await db.insert(generation).values(values).returning();
  return rows[0];
}

/** Idempotent replay lookup: the caller's (userId, retry key) pair. */
export async function findGenerationByIdempotencyKey(
  db: Database,
  ownerId: string,
  idempotencyKey: string,
): Promise<GenerationRow | null> {
  const rows = await db
    .select()
    .from(generation)
    .where(
      and(
        eq(generation.userId, ownerId),
        eq(generation.idempotencyKey, idempotencyKey),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function listRecentGenerations(
  db: Database,
  ownerId: string,
  limit = 20,
): Promise<GenerationRow[]> {
  return db
    .select()
    .from(generation)
    .where(eq(generation.userId, ownerId))
    .orderBy(desc(generation.createdAt))
    .limit(limit);
}

export async function findGenerationById(
  db: Database,
  ownerId: string,
  id: string,
): Promise<GenerationRow | null> {
  const rows = await db
    .select()
    .from(generation)
    .where(and(eq(generation.id, id), eq(generation.userId, ownerId)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Terminal success transition: only a `processing` row can become
 * `succeeded`, so a replayed or swept row can never flip states twice.
 */
export async function markGenerationSucceeded(
  db: Database,
  id: string,
  r2Key: string,
): Promise<GenerationRow | null> {
  const rows = await db
    .update(generation)
    .set({ status: "succeeded", r2Key })
    .where(and(eq(generation.id, id), eq(generation.status, "processing")))
    .returning();
  return rows[0] ?? null;
}

/** Terminal failure transition; refunds are the caller's responsibility. */
export async function markGenerationFailed(
  db: Database,
  id: string,
  errorKind: GenerationRow["errorKind"],
  errorMessage: string,
): Promise<void> {
  await db
    .update(generation)
    .set({
      status: "failed",
      errorKind,
      errorMessage: errorMessage.slice(0, 500),
    })
    .where(eq(generation.id, id));
}
