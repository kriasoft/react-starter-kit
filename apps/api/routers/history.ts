/**
 * Read-only generation history for the signed-in user. The public gallery
 * (unauthenticated, SEO pages) will be a separate router with its own
 * visibility rules; this one is strictly "my generations".
 */

import type { Database } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  findGenerationById,
  listRecentGenerations,
  type GenerationRow,
} from "../lib/generations.js";
import { protectedProcedure, router } from "../lib/trpc.js";

export const historyRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return selectRecentGenerations(ctx.db, ctx.user.id);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const found = await selectGeneration(ctx.db, ctx.user.id, input.id);
      if (!found) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }
      return found;
    }),
});

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

async function selectRecentGenerations(db: Database, userId: string) {
  const rows = await listRecentGenerations(db, userId);
  return rows.map(toGenerationDto);
}

async function selectGeneration(db: Database, userId: string, id: string) {
  const row = await findGenerationById(db, userId, id);
  return row ? toGenerationDto(row) : null;
}
