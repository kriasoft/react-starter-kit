/**
 * @file Database schema exports.
 *
 * Re-exports Drizzle ORM schemas for users, organizations, and authentication.
 */

import * as schema from "./schema";

export * from "./schema";
export { schema };
export type DatabaseSchema = typeof schema;
