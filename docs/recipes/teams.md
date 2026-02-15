# Adding Teams

Teams let you create subgroups within organizations. This recipe shows how to enable Better Auth's teams plugin.

## 1. Add the schema

Create `db/schema/team.ts`:

```typescript
import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";

export const team = pgTable(
  "team",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text().notNull(),
    organizationId: text()
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("team_organization_id_idx").on(table.organizationId)],
);

export const teamMember = pgTable(
  "team_member",
  {
    id: text()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    teamId: text()
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("team_member_team_user_unique").on(table.teamId, table.userId),
    index("team_member_team_id_idx").on(table.teamId),
    index("team_member_user_id_idx").on(table.userId),
  ],
);

export const teamRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id],
  }),
  members: many(teamMember),
}));

export const teamMemberRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id],
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id],
  }),
}));
```

Export it from `db/schema/index.ts`:

```typescript
export * from "./team";
```

## 2. Add session and invitation fields

Add `activeTeamId` to the session table in `db/schema/user.ts`:

```typescript
// In the session table definition
activeTeamId: text(),
```

Optionally add `teamId` to the invitation table in `db/schema/invitation.ts` if you want team-scoped invitations:

```typescript
teamId: text().references(() => team.id, { onDelete: "cascade" }),
```

## 3. Enable the teams plugin

In `apps/api/lib/auth.ts`, enable teams in the organization plugin and add the schema mapping:

```typescript
// Add to the drizzle adapter schema mapping
schema: {
  // ...existing mappings
  team: Db.team,
  teamMember: Db.teamMember,
},

// Enable teams in the organization plugin
organization({
  // ...existing config
  teams: { enabled: true },
}),
```

## 4. Apply the migration

```bash
bun db:generate
bun db:push  # or bun db:migrate
```

## Reference

- [Better Auth organization plugin — Teams](https://www.better-auth.com/docs/plugins/organization#teams)
