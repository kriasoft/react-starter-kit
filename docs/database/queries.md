---
outline: [2, 3]
---

# Query Patterns

Common patterns for querying the database in tRPC procedures. Use `ctx.db` by default; opt into `ctx.dbCached` only for reads whose configured staleness window is acceptable.

## Multi-tenant Queries

Every query that returns tenant data must be scoped to the current organization. The active ID selects the scope; it does not prove the user is still a member, because an older session can outlive a membership change. Resolve both before reading tenant data:

```ts
const organizationId = ctx.session.activeOrganizationId;
if (!organizationId) {
  throw new TRPCError({ code: "PRECONDITION_FAILED" });
}

const membership = await ctx.db.query.member.findFirst({
  where: (m, { and, eq }) =>
    and(eq(m.userId, ctx.user.id), eq(m.organizationId, organizationId)),
});
if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

const products = await ctx.db.query.product.findMany({
  where: eq(product.organizationId, organizationId),
});
```

::: warning

Forgetting either the membership check or the organization filter leaks data across tenants. Treat both as security invariants – every table with an `organizationId` column must filter by it.

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

## Avoiding N+1 Queries

Fetching related rows one at a time inside a loop issues one query per row. Drizzle's `with` clause (above) resolves relations in a single round trip, and a single `inArray` lookup covers the rest:

```ts
const creators = await ctx.db.query.user.findMany({
  columns: { id: true, name: true },
  where: (u, { inArray }) =>
    inArray(
      u.id,
      products.map((p) => p.createdBy),
    ),
});
```

If a procedure grows past what those two cover, reach for a batching library such as [DataLoader](https://github.com/graphql/dataloader) then – not before.

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
