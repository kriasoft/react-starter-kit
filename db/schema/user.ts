/**
 * Database schema for Better Auth authentication system.
 *
 * This schema is designed to be fully compatible with Better Auth's database
 * requirements as documented at https://www.better-auth.com/docs/concepts/database
 *
 * Tables defined:
 * - `user`: Core user accounts with profile information
 * - `session`: Active user sessions for authentication state
 * - `identity`: OAuth provider accounts (renamed from Better Auth's `account`)
 * - `verification`: Tokens for email verification and password resets
 *
 * @remarks
 * - All tables include required Better Auth fields
 * - Uses PostgreSQL with Drizzle ORM for Neon compatibility
 *
 * @see https://www.better-auth.com/docs/concepts/database - Better Auth database schema
 * @see https://www.better-auth.com/docs/adapters/drizzle - Drizzle adapter configuration
 *
 * SPDX-FileCopyrightText: 2014-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { relations, sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * User accounts table.
 * Matches to the `user` table in Better Auth.
 */
export const user = pgTable("user", {
  id: text()
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  isAnonymous: boolean("is_anonymous")
    .$default(() => false)
    .notNull(),
  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Stores user session data for authentication.
 * Matches to the `session` table in Better Auth.
 */
export const session = pgTable("session", {
  id: text("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
  activeTeamId: text("active_team_id"),
});

/**
 * Stores OAuth provider account information.
 * Matches to the `account` table in Better Auth.
 */
export const identity = pgTable("identity", {
  id: text("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
    mode: "date",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Stores verification tokens (email verification, password reset, etc.)
 * Matches to the `verification` table in Better Auth.
 */
export const verification = pgTable("verification", {
  id: text("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// —————————————————————————————————————————————————————————————————————————————
// Relations for better query experience
// —————————————————————————————————————————————————————————————————————————————

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  identities: many(identity),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const identityRelations = relations(identity, ({ one }) => ({
  user: one(user, {
    fields: [identity.userId],
    references: [user.id],
  }),
}));
