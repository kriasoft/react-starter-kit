/**
 * @file Database schema exports.
 *
 * Re-exports Drizzle ORM schemas for users, organizations, and authentication.
 */

import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export * from "./schema";
export { schema };
export type DatabaseSchema = typeof schema;

/**
 * A Drizzle client bound to this schema, whatever driver is underneath.
 *
 * Driver-specific command results resolve to `unknown`, and `$client` is not
 * exposed. Use `.returning()` when a mutation needs a schema-typed result.
 */
export type Database = PgDatabase<
  PgQueryResultHKT,
  DatabaseSchema,
  ExtractTablesWithRelations<DatabaseSchema>
>;
