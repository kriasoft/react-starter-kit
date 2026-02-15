// Better Auth invitation system for organization invites

import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";

/**
 * Invitations table for Better Auth organization plugin.
 * Manages pending invites to organizations.
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
    status: text().default("pending").notNull(),
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
    unique("invitation_org_email_unique").on(table.organizationId, table.email),
    index("invitation_email_idx").on(table.email),
    index("invitation_inviter_id_idx").on(table.inviterId),
    index("invitation_organization_id_idx").on(table.organizationId),
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
}));
