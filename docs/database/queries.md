---
outline: [2, 3]
---

# Query Patterns

Common patterns for querying the database in tRPC procedures. All examples use Drizzle ORM's relational query API and assume access to `ctx.db` from [tRPC context](/api/context).

## Multi-tenant Queries

Every query that returns user data must be scoped to the current organization. The active organization ID is available on the session:

```ts
const products = await ctx.db.query.product.findMany({
  where: eq(product.organizationId, ctx.session.activeOrganizationId),
});
```

::: warning
Forgetting the organization filter leaks data across tenants. Treat this as a security invariant – every table with an `organizationId` column must filter by it.
:::

## Relations

Drizzle's `with` clause loads related records in a single query:

```ts
const org = await ctx.db.query.organization.findFirst({
  where: eq(organization.id, orgId),
  with: {
    members: {
      with: { user: true },
    },
  },
});
```

Select only the columns you need to reduce payload size:

```ts
const products = await ctx.db.query.product.findMany({
  where: eq(product.organizationId, orgId),
  columns: { id: true, name: true, price: true },
  with: {
    creator: {
      columns: { id: true, name: true },
    },
  },
});
```

## DataLoader Pattern

The API uses a [DataLoader](https://github.com/graphql/dataloader) pattern to batch lookups and prevent N+1 queries. Loaders are defined with `defineLoader` and cached per-request in `ctx.cache`:

```ts
// apps/api/lib/loaders.ts (simplified)
export const userById = defineLoader(
  Symbol("userById"),
  async (ctx, ids: readonly string[]) => {
    const users = await ctx.db
      .select()
      .from(user)
      .where(inArray(user.id, [...ids]));
    return mapByKey(users, "id", ids);
  },
);
```

Use loaders when a procedure needs to fetch the same entity type for multiple IDs:

```ts
const creator = await userById(ctx).load(product.createdBy);
```

See [Context & Middleware – DataLoaders](/api/context#dataloaders) for the full pattern and how to add new loaders.

## Access Control

Verify organization membership before returning data:

```ts
const membership = await ctx.db.query.member.findFirst({
  where: and(eq(member.userId, ctx.user.id), eq(member.organizationId, orgId)),
});

if (!membership) {
  throw new TRPCError({ code: "FORBIDDEN" });
}
```

Check roles for privileged operations:

```ts
if (membership.role !== "owner" && membership.role !== "admin") {
  throw new TRPCError({ code: "FORBIDDEN" });
}
```

## Design Patterns

### Multi-tenant Data Isolation

Every domain table should reference an organization with cascade delete:

```ts
export const yourTable = pgTable("your_table", {
  id: text()
    .primaryKey()
    .$defaultFn(() => generateId("xxx")),
  organizationId: text()
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  // ...
});
```

### Soft Deletes

When you need to preserve records for auditing:

```ts
// Schema
deletedAt: timestamp({ withTimezone: true, mode: "date" }),

// Query – exclude soft-deleted records
const active = await ctx.db.query.product.findMany({
  where: and(
    eq(product.organizationId, orgId),
    isNull(product.deletedAt),
  ),
});

// Soft delete
await ctx.db
  .update(product)
  .set({ deletedAt: new Date() })
  .where(eq(product.id, productId));
```

### Audit Fields

Track who created and modified records:

```ts
createdBy: text().references(() => user.id),
updatedBy: text().references(() => user.id),
```

### Batch Inserts

Use array values for bulk operations:

```ts
await ctx.db.insert(product).values([
  { name: "Product A", price: 1000, organizationId: orgId },
  { name: "Product B", price: 2000, organizationId: orgId },
]);
```
