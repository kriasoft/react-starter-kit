// Better Auth invitation system for organization and team invites

import { relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { team } from "./team";
import { user } from "./user";

/**
 * Invitation status enum matching Better Auth's expected values.
 * @see ~/gh/better-auth/packages/better-auth/src/plugins/organization/schema.ts
 */
export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "rejected",
  "canceled",
]);

export type InvitationStatus = (typeof invitationStatusEnum.enumValues)[number];

/**
 * Invitations table for Better Auth organization and teams plugins.
 * Manages pending invites to organizations and teams.
 *
 * Lifecycle timestamps:
 * - acceptedAt: When the invite was accepted
 * - rejectedAt: When the invite was rejected or canceled
 */
export const invitation = pgTable(
  "invitation",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text().notNull(),
    inviterId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text().notNull(),
    status: invitationStatusEnum().default("pending").notNull(),
    teamId: text().references(() => team.id, { onDelete: "cascade" }),
    expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
    acceptedAt: timestamp({ withTimezone: true, mode: "date" }),
    rejectedAt: timestamp({ withTimezone: true, mode: "date" }),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    // Prevent duplicate invites (NULLs NOT DISTINCT treats NULL teamId as equal)
    unique("invitation_org_email_team_unique")
      .on(table.organizationId, table.email, table.teamId)
      .nullsNotDistinct(),
    index("invitation_email_idx").on(table.email),
    index("invitation_inviter_id_idx").on(table.inviterId),
    index("invitation_organization_id_idx").on(table.organizationId),
    index("invitation_team_id_idx").on(table.teamId),
  ],
);

export type Invitation = typeof invitation.$inferSelect;
export type NewInvitation = typeof invitation.$inferInsert;

// —————————————————————————————————————————————————————————————————————————————
// Relations for better query experience
// —————————————————————————————————————————————————————————————————————————————

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id],
  }),
  team: one(team, {
    fields: [invitation.teamId],
    references: [team.id],
  }),
}));
