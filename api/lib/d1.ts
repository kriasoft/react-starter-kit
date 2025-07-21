/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { schema } from "@root/db";
import type { AnyD1Database } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/d1";

/**
 * Creates a Cloudflare D1 database client using Drizzle ORM.
 *
 * @remarks
 * D1 is Cloudflare's SQLite-based database designed for edge computing.
 * This function creates a Drizzle ORM instance that works with D1 bindings
 * in Cloudflare Workers runtime.
 *
 * @param db The D1 database binding from Cloudflare Workers environment
 * @returns Drizzle ORM database instance configured for D1
 *
 * @example
 * // In Cloudflare Workers context
 * const db = createD1Db(env.DB);
 * const users = await db.select().from(schema.users);
 */
export function createD1Db(db: AnyD1Database) {
  return drizzle(db, { schema });
}

export { schema as Db } from "@root/db";
