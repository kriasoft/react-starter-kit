/**
 * WebAuthn (FIDO2) passkey credentials used by Better Auth's passkey plugin.
 * Each row = one registered authenticator (device / platform credential) for a user.
 *
 * @see https://www.better-auth.com/docs/plugins/passkey - Better Auth passkey documentation
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./user";

/**
 * Passkey credential store.
 */
export const passkey = pgTable("passkey", {
  id: text("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),

  // User-friendly name for the passkey (e.g., "iPhone Face ID", "YubiKey 5")
  name: text("name"),

  // The public key of the passkey credential
  publicKey: text("public_key").notNull(),

  // Reference to the user who owns this passkey
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Unique identifier of the registered credential
  credentialID: text("credential_id").notNull().unique(),

  // Signature counter to prevent replay attacks
  counter: integer("counter").notNull(),

  // Type of device used (e.g., "singleDevice" or "multiDevice")
  deviceType: text("device_type").notNull(),

  // Whether the passkey is backed up (cloud sync enabled)
  backedUp: boolean("backed_up").notNull(),

  // Supported transports (e.g., "usb", "nfc", "ble", "internal")
  transports: text("transports"),

  // Authenticator Attestation GUID - identifies the type of authenticator
  aaguid: text("aaguid"),

  // Timestamp when the passkey was registered
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
});

export type Passkey = typeof passkey.$inferSelect;
export type NewPasskey = typeof passkey.$inferInsert;
