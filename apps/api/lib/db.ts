/**
 * @file Database client using Neon PostgreSQL via Cloudflare Hyperdrive.
 *
 * Two bindings available: HYPERDRIVE_UNCACHED (always fresh, the default) and
 * HYPERDRIVE_CACHED (served from the cache window Terraform configures).
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
    // Each request builds two clients (cached + uncached), and Workers caps
    // concurrent external connections. One apiece stays well inside that.
    max: 1,
    connect_timeout: 10,
    // Prepared statements left on (postgres.js default). Hyperdrive only caches
    // queries it sees prepared; `prepare: false` would cost it the cache and an
    // extra round-trip. This is why the origin must be an unpooled host – a
    // transaction-mode pooler in front of Postgres breaks prepared statements.
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
