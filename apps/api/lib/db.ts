/**
 * @file Database client using Neon PostgreSQL via Cloudflare Hyperdrive.
 *
 * Two bindings available: HYPERDRIVE_CACHED (60s cache) and HYPERDRIVE_DIRECT (no cache).
 */

import { schema } from "@repo/db";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Creates a database client using Drizzle ORM and Cloudflare Hyperdrive.
 *
 * @param db - Cloudflare Hyperdrive binding providing connection string
 */
export function createDb(db: Hyperdrive) {
  const client = postgres(db.connectionString, {
    max: 1,
    connect_timeout: 10,
    prepare: false, // Avoids prepared statement caching issues in Workers
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    transform: {
      undefined: null,
    },
    onnotice: () => {},
  });

  return drizzle(client, { schema, casing: "snake_case" });
}

export { schema as Db };
