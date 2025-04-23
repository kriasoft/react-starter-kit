/**
 * @fileoverview Database schema for user accounts, sessions, identities,
 * and verification tokens. Defines tables: user, session, identity,
 * verification.
 */

/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * User accounts table.
 * Matches to the `user` table in Better Auth.
 */
export const user = sqliteTable("user", {
  id: text().primaryKey(), // User ID from identity provider
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: int("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  // GitHub-specific fields
  ghUsername: text("gh_username"),
  ghUserId: text("gh_user_id"),
  // Timestamps
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

/**
 * Stores user session data for authentication.
 * Matches to the `session` table in Better Auth.
 */
export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * Stores OAuth provider account information.
 * Matches to the `account` table in Better Auth.
 */
export const identity = sqliteTable("identity", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: int("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: int("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

/**
 * Stores verification tokens (email verification, password reset, etc.)
 * Matches to the `verification` table in Better Auth.
 */
export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
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
