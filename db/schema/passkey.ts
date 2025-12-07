// WebAuthn passkey credentials for Better Auth
// @see https://www.better-auth.com/docs/plugins/passkey

import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";

/**
 * Passkey credential store.
 *
 * Extended fields beyond Better Auth defaults:
 * - lastUsedAt: Tracks last authentication for security audits
 * - deviceName: User-friendly name (e.g., "MacBook Pro", "iPhone 15")
 * - platform: Authenticator platform ("platform" | "cross-platform")
 */
export const passkey = pgTable(
  "passkey",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text(),
    publicKey: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text().notNull().unique(),
    counter: integer().default(0).notNull(),
    deviceType: text().notNull(),
    backedUp: boolean().notNull(),
    transports: text(),
    aaguid: text(),
    // Extended operational fields
    lastUsedAt: timestamp({ withTimezone: true, mode: "date" }),
    deviceName: text(),
    platform: text(), // "platform" | "cross-platform"
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("passkey_user_id_idx").on(table.userId)],
);

export type Passkey = typeof passkey.$inferSelect;
export type NewPasskey = typeof passkey.$inferInsert;
