/**
 * Alternative database client using Neon (PostgreSQL) instead of Cloudflare D1 (SQLite).
 *
 * Provides the same Drizzle ORM interface as the default D1 setup but connects to
 * Neon via Cloudflare Hyperdrive for connection pooling and edge optimization.
 *
 * Two Hyperdrive bindings are available:
 * - HYPERDRIVE: Cached connection with 60-second cache for read-heavy operations
 * - HYPERDRIVE_DIRECT: Direct connection with no caching for real-time data operations
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { schema } from "@root/db";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Creates a database client using Drizzle ORM and Cloudflare Hyperdrive.
 *
 * @param db - Cloudflare Hyperdrive binding
 * @returns Drizzle ORM database client
 *
 * @example
 * ```typescript
 * // In Cloudflare Workers context
 *
 * // Use cached connection for read-heavy operations
 * const db = createDb(env.HYPERDRIVE);
 * const activeUsers = await db.select().from(Db.users).where(eq(Db.users.isActive, true));
 *
 * // Use direct connection for real-time operations
 * const dbDirect = createDb(env.HYPERDRIVE_DIRECT);
 * await dbDirect.insert(Db.users).values({ name: 'John', email: 'john@example.com' });
 * ```
 */
export function createDb(db: Hyperdrive) {
  const client = postgres(db.connectionString, {
    max: 1,
    connect_timeout: 10,
    prepare: false, // Recommended for Cloudflare Workers
    idle_timeout: 20, // Close idle connections quickly
    max_lifetime: 60 * 30, // 30 minutes max connection lifetime
    transform: {
      undefined: null, // Convert undefined to null for PostgreSQL
    },
    onnotice: () => {}, // Suppress notices in Workers
  });

  return drizzle(client, { schema });
}

export { schema as Db };
