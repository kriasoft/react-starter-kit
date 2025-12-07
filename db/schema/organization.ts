// Multi-tenant organizations and memberships with role-based access control

import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./user";

/**
 * Organizations table for Better Auth organization plugin.
 * Each organization represents a separate tenant with isolated data.
 */
export const organization = pgTable("organization", {
  id: text()
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text().notNull(),
  slug: text().notNull().unique(),
  logo: text(),
  metadata: text(), // Better Auth expects string (JSON serialized)
  createdAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;

/**
 * Organization membership table for Better Auth organization plugin.
 * Links users to organizations with specific roles.
 *
 * Role values (Better Auth defaults):
 * - "owner": Full control, can delete organization
 * - "admin": Can manage members and settings
 * - "member": Standard access
 *
 * @see apps/api/lib/auth.ts creatorRole config
 */
export const member = pgTable(
  "member",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text().notNull(), // "owner" | "admin" | "member"
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("member_user_org_unique").on(table.userId, table.organizationId),
    index("member_user_id_idx").on(table.userId),
    index("member_organization_id_idx").on(table.organizationId),
  ],
);

export type Member = typeof member.$inferSelect;
export type NewMember = typeof member.$inferInsert;

// —————————————————————————————————————————————————————————————————————————————
// Relations for better query experience
// —————————————————————————————————————————————————————————————————————————————

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member),
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
}));
