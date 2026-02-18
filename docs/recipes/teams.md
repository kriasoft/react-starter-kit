# Add Teams

Teams let you create subgroups within organizations. This recipe enables Better Auth's [teams feature](https://www.better-auth.com/docs/plugins/organization#teams) and wires it into the existing schema.

## 1. Add the schema

Create `db/schema/team.ts`:

```typescript
import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { generateId } from "./id";
import { organization } from "./organization";
import { user } from "./user";

export const team = pgTable(
  "team",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("tea")),
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
      .$defaultFn(() => generateId("tmb")),
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
export * from "./team"; // [!code ++]
```

## 2. Extend session and invitation tables

Add `activeTeamId` to the session table in `db/schema/user.ts`:

```typescript
export const session = pgTable(
  "session",
  {
    // ...existing columns
    activeOrganizationId: text(),
    activeTeamId: text(), // [!code ++]
  },
  // ...
);
```

Add `teamId` to the invitation table in `db/schema/invitation.ts` for team-scoped invitations:

```typescript
export const invitation = pgTable(
  "invitation",
  {
    // ...existing columns
    teamId: text().references(() => team.id, { onDelete: "cascade" }), // [!code ++]
  },
  // ...
);
```

## 3. Enable the teams plugin

In `apps/api/lib/auth.ts`, add the new tables to the Drizzle adapter schema and enable teams in the organization plugin:

```typescript
database: drizzleAdapter(db, {
  provider: "pg",
  schema: {
    // ...existing mappings
    team: Db.team, // [!code ++]
    teamMember: Db.teamMember, // [!code ++]
  },
}),

// ...

plugins: [
  organization({
    allowUserToCreateOrganization: true,
    organizationLimit: 5,
    creatorRole: "owner",
    teams: { enabled: true }, // [!code ++]
  }),
],
```

In `apps/app/lib/auth.ts`, enable teams on the client:

```typescript
export const auth = createAuthClient({
  // ...
  plugins: [
    organizationClient({
      teams: { enabled: true }, // [!code ++]
    }),
    // ...other plugins
  ],
});
```

## 4. Apply the migration

```bash
bun db:generate
bun db:push
```

## 5. Use the teams API

Create a team within the active organization:

```ts
await auth.organization.createTeam({
  name: "Engineering",
});
```

Set the active team for the current session:

```ts
await auth.organization.setActiveTeam({
  teamId: "tea_...",
});
```

List teams and manage members:

```ts
// List teams in the active organization
const { data: teams } = await auth.organization.listTeams();

// Add a member to a team
await auth.organization.addTeamMember({
  teamId: "tea_...",
  userId: "usr_...",
});

// Remove a member from a team
await auth.organization.removeTeamMember({
  teamId: "tea_...",
  userId: "usr_...",
});
```

The active team ID is available in the session as `session.activeTeamId`, alongside the existing `session.activeOrganizationId`.

## Reference

- [Better Auth organization plugin – Teams](https://www.better-auth.com/docs/plugins/organization#teams)
- [Organizations & Roles](/auth/organizations) – base organization setup
