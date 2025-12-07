/**
 * Data loaders. Usage example:
 *
 * ```ts
 * protectedProcedure
 *   .query(async ({ ctx }) => {
 *     const user = await userById(ctx).load(ctx.session.userId);
 *     ...
 *   })
 * ```
 */

import DataLoader from "dataloader";
import { inArray } from "drizzle-orm";
import { user } from "@repo/db/schema/user.js";
import type { TRPCContext } from "./context";

// The list of data loader keys to be used with the context cache
// to avoid creating multiple instances of the same data loader.
export const USER_BY_ID = Symbol("userById");
export const USER_BY_EMAIL = Symbol("userByEmail");

function createKeyMap<T, K extends keyof T>(
  items: T[],
  keyField: K,
): Map<T[K], T> {
  return new Map(items.map((item) => [item[keyField], item]));
}

export function userById(ctx: TRPCContext) {
  if (!ctx.cache.has(USER_BY_ID)) {
    const loader = new DataLoader(async (userIds: readonly string[]) => {
      if (userIds.length === 0) return [];

      const users = await ctx.db
        .select()
        .from(user)
        .where(inArray(user.id, [...userIds]));
      const userMap = createKeyMap(users, "id");
      return userIds.map((id) => userMap.get(id) || null);
    });
    ctx.cache.set(USER_BY_ID, loader);
  }
  return ctx.cache.get(USER_BY_ID) as DataLoader<
    string,
    typeof user.$inferSelect | null
  >;
}

export function userByEmail(ctx: TRPCContext) {
  if (!ctx.cache.has(USER_BY_EMAIL)) {
    const loader = new DataLoader(async (emails: readonly string[]) => {
      if (emails.length === 0) return [];

      const users = await ctx.db
        .select()
        .from(user)
        .where(inArray(user.email, [...emails]));
      const userMap = createKeyMap(users, "email");
      return emails.map((email) => userMap.get(email) || null);
    });
    ctx.cache.set(USER_BY_EMAIL, loader);
  }
  return ctx.cache.get(USER_BY_EMAIL) as DataLoader<
    string,
    typeof user.$inferSelect | null
  >;
}
