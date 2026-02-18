---
url: /recipes/new-table.md
---
# Add a Database Table

This recipe walks through adding a new database table, from schema definition to querying it in the API.

## 1. Define the schema

Create a file in `db/schema/` with your table definition:

```ts
// db/schema/project.ts
import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { generateId } from "./id";
import { organization } from "./organization";

export const project = pgTable(
  "project",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => generateId("prj")),
    name: text().notNull(),
    description: text(),
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
  (table) => [index("project_organization_id_idx").on(table.organizationId)],
);

export const projectRelations = relations(project, ({ one }) => ({
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
}));

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
```

Key conventions:

* **IDs** – use `generateId("xxx")` with a unique 3-letter prefix (see [Schema](/database/schema) for existing prefixes)
* **Timestamps** – always include `createdAt` and `updatedAt` with timezone
* **Foreign keys** – use `onDelete: "cascade"` for owned resources
* **Indexes** – add indexes on columns used in `WHERE` or `JOIN` clauses
* **Casing** – write TypeScript in camelCase; Drizzle converts to snake\_case automatically

## 2. Export from the barrel file

```ts
// db/schema/index.ts
export * from "./project"; // [!code ++]
```

## 3. Generate and apply the migration

```bash
bun db:generate    # Creates a new SQL migration file in db/migrations/
bun db:push        # Applies it to your local database
```

Review the generated SQL in `db/migrations/` before applying to staging or production.

## 4. Add seed data (optional)

Create a seed function:

```ts
// db/seeds/projects.ts
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "../schema";
import { project } from "../schema";

export async function seedProjects(db: PostgresJsDatabase<typeof schema>) {
  const projects = [
    { name: "Acme Dashboard", organizationId: "org_..." },
    { name: "Mobile App", organizationId: "org_..." },
  ];

  for (const p of projects) {
    await db.insert(project).values(p).onConflictDoNothing();
  }

  console.log(`Seeded ${projects.length} projects`);
}
```

Call it from `db/scripts/seed.ts`:

```ts
import { seedProjects } from "../seeds/projects";

await seedProjects(db);
```

## 5. Query in a tRPC procedure

```ts
// apps/api/routers/project.ts
import { protectedProcedure, router } from "../lib/trpc.js";

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.project.findMany({
      where: (p, { eq }) =>
        eq(p.organizationId, ctx.session.activeOrganizationId!),
      orderBy: (p, { desc }) => desc(p.createdAt),
    });
  }),
});
```

See [Add a tRPC Procedure](/recipes/new-procedure) for the full frontend wiring.

## Reference

* [Schema](/database/schema) – column conventions, ID prefixes, entity reference
* [Migrations](/database/migrations) – migration workflow and best practices
* [Query Patterns](/database/queries) – multi-tenant queries, joins, transactions
