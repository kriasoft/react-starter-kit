/**
 * @fileoverview Database schema for multi-tenant SaaS organizations and
 * memberships. Defines tables: organization, member, invite with role-based
 * access control.
 */

/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user.js";

/**
 * Organizations table for multi-tenant SaaS architecture.
 * Each organization represents a separate tenant with isolated data.
 */
export const organization = sqliteTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL-friendly identifier
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  // Subscription and billing
  planType: text("plan_type", { enum: ["free", "pro", "enterprise"] })
    .$defaultFn(() => "free")
    .notNull(),
  subscriptionStatus: text("subscription_status", {
    enum: ["active", "canceled", "past_due", "trialing"],
  }),
  subscriptionId: text("subscription_id"), // External billing provider ID
  trialEndsAt: int("trial_ends_at", { mode: "timestamp" }),
  // Settings
  settings: text("settings", { mode: "json" }).$type<{
    allowInvites?: boolean;
    requireEmailVerification?: boolean;
    maxMembers?: number;
  }>(),
  // Timestamps
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

/**
 * Organization membership table with role-based access control.
 * Links users to organizations with specific roles and permissions.
 */
export const member = sqliteTable("member", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["owner", "admin", "member", "viewer"] })
    .notNull()
    .$defaultFn(() => "member"),
  status: text("status", { enum: ["active", "invited", "suspended"] })
    .notNull()
    .$defaultFn(() => "invited"),
  // Invitation metadata
  invitedBy: text("invited_by").references(() => user.id),
  invitedAt: int("invited_at", { mode: "timestamp" }),
  joinedAt: int("joined_at", { mode: "timestamp" }),
  // Timestamps
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

// Relations for better query experience
export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
  invites: many(invite),
}));

export const memberRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [member.invitedBy],
    references: [user.id],
  }),
}));

/**
 * Organization invitations table for managing pending invites.
 * Separate from member table to track invite tokens and expiration.
 */
export const invite = sqliteTable("invite", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(), // Secure invite token for links
  email: text("email").notNull(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["admin", "member", "viewer"] })
    .notNull()
    .$defaultFn(() => "member"),
  status: text("status", {
    enum: ["pending", "accepted", "expired", "revoked"],
  })
    .notNull()
    .$defaultFn(() => "pending"),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => user.id),
  acceptedBy: text("accepted_by").references(() => user.id),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
  // Timestamps
  createdAt: int("created_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" })
    .$default(() => new Date())
    .notNull(),
});

export const inviteRelations = relations(invite, ({ one }) => ({
  organization: one(organization, {
    fields: [invite.organizationId],
    references: [organization.id],
  }),
  inviter: one(user, {
    fields: [invite.invitedBy],
    references: [user.id],
  }),
  accepter: one(user, {
    fields: [invite.acceptedBy],
    references: [user.id],
  }),
}));
