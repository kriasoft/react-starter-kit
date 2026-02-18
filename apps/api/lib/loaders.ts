/**
 * Request-scoped DataLoaders for batching and N+1 prevention.
 *
 * @example
 * ```ts
 * protectedProcedure
 *   .query(async ({ ctx }) => {
 *     const user = await userById(ctx).load(ctx.session.userId);
 *   })
 * ```
 */

import DataLoader from "dataloader";
import { inArray } from "drizzle-orm";
import { user } from "@repo/db/schema/user.js";
import type { TRPCContext } from "./context";

/** Map fetched items by key, preserving input order (nulls for missing). */
function mapByKey<T, K extends keyof T>(
  items: T[],
  keyField: K,
  keys: readonly T[K][],
): (T | null)[] {
  const map = new Map(items.map((item) => [item[keyField], item]));
  return keys.map((k) => map.get(k) ?? null);
}

/** Create a request-scoped DataLoader (one instance per request via ctx.cache). */
function defineLoader<K, V>(
  key: symbol,
  batchFn: (ctx: TRPCContext, keys: readonly K[]) => Promise<(V | null)[]>,
): (ctx: TRPCContext) => DataLoader<K, V | null> {
  return (ctx) => {
    let loader = ctx.cache.get(key) as DataLoader<K, V | null> | undefined;
    if (!loader) {
      loader = new DataLoader((keys: readonly K[]) => batchFn(ctx, keys));
      ctx.cache.set(key, loader);
    }
    return loader;
  };
}

export const userById = defineLoader(
  Symbol("userById"),
  async (ctx, ids: readonly string[]) => {
    const users = await ctx.db
      .select()
      .from(user)
      .where(inArray(user.id, [...ids]));
    return mapByKey(users, "id", ids);
  },
);

export const userByEmail = defineLoader(
  Symbol("userByEmail"),
  async (ctx, emails: readonly string[]) => {
    const users = await ctx.db
      .select()
      .from(user)
      .where(inArray(user.email, [...emails]));
    return mapByKey(users, "email", emails);
  },
);
