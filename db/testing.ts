/** @file In-process PGlite database for tests. */

import { PGlite } from "@electric-sql/pglite";
import { is } from "drizzle-orm";
import { getTableConfig, PgTable } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { fileURLToPath } from "node:url";
import type { Database } from "./index";
import * as schema from "./schema";

// `fileURLToPath`, not `.pathname`: a checkout under a path containing a space
// arrives percent-encoded, and the read then fails on a directory that looks
// correct in the error message.
const MIGRATIONS_FOLDER = fileURLToPath(
  new URL("./migrations", import.meta.url),
);

// Derive the schema-qualified list so new tables are reset automatically and
// tables declared through `pgSchema` do not depend on `search_path`.
const ALL_TABLES = Object.values(schema)
  .filter((value) => is(value, PgTable))
  .map(getTableConfig)
  .map(({ schema: namespace, name }) =>
    namespace ? `"${namespace}"."${name}"` : `"${name}"`,
  )
  .join(", ");

export type TestDatabase = {
  /** The same schema-bound interface used by production code. */
  db: Database;

  /** Deletes every row, keeping the schema. Fast enough for `beforeEach`. */
  reset(): Promise<void>;

  close(): Promise<void>;
};

/**
 * A fresh database with the committed migrations applied.
 *
 * Migrations, not `push`: the tests then run against the schema production
 * actually receives, and a migration that fails to apply fails here rather than
 * on deploy. Each call gets its own in-memory instance, so test files cannot
 * see one another's rows and can run in parallel.
 *
 * Create one per test file and call `reset()` between tests.
 */
export async function createTestDatabase(): Promise<TestDatabase> {
  const client = new PGlite();
  const db = drizzle(client, { schema, casing: "snake_case" });

  try {
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  } catch (error) {
    // The caller never receives `close` when migration fails.
    await client.close();
    throw error;
  }

  return {
    db,
    // No `cascade`: naming every table in one statement already satisfies the
    // foreign keys, and `cascade` would silently empty unlisted ones too.
    reset: async () => {
      await client.exec(`truncate table ${ALL_TABLES}`);
    },
    close: () => client.close(),
  };
}
