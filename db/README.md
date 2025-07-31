# Database Layer

Welcome to the database layer of our React Starter Kit! This is where the magic happens (or where things break spectacularly if you're not careful). This directory contains everything you need to manage your database schemas, migrations, and that one table you'll inevitably forget to index.

## Architecture Overview

We're using [Drizzle ORM](https://orm.drizzle.team/) with [Neon PostgreSQL](https://neon.tech/) for both local development and production. The database is accessed via Cloudflare Hyperdrive for connection pooling and edge optimization.

### Why Drizzle?

- **Type-safe**: Your database queries are as type-safe as your TypeScript
- **Zero runtime**: Unlike some ORMs that ship half of npm to your app bundle
- **SQL-like**: If you know SQL, you already know 90% of Drizzle
- **Edge-ready**: Works perfectly with Cloudflare Workers, Vercel Edge Functions, etc.

## Project Structure

```
db/
├── schema/                # Database schema definitions
│   ├── index.ts           # Central export for all schemas
│   ├── user.ts            # Authentication tables (user, session, identity, etc.)
│   └── organization.ts    # Multi-tenant SaaS tables (organization, member, invite)
├── migrations/            # Auto-generated migration files (do not edit manually)
├── seeds/                 # Seed data files (executed in order)
├── drizzle.config.ts      # Drizzle ORM configuration
└── package.json           # Scripts and dependencies for the db layer
```

## Database Design

### Authentication Domain (`user.ts`)

Our authentication system uses [Better Auth](https://www.better-auth.com/) patterns:

- **`user`**: Core user accounts
- **`session`**: Active user sessions
- **`identity`**: OAuth provider credentials
- **`verification`**: Email verification tokens

### Multi-Tenant Domain (`organization.ts`)

Built for SaaS applications where multiple organizations share the same infrastructure:

- **`organization`**: Company/team containers with subscription management
- **`member`**: User-organization relationships with RBAC (roles: owner, admin, member, viewer)
- **`invite`**: Token-based invitation system (because email invites should actually work)

### Key Design Decisions

1. **Singular table names**: `user` not `users` (because English is weird enough)
2. **Snake case columns**: `created_at` not `createdAt` (SQL convention)
3. **Cascade deletes**: When organizations disappear, so do their members (no database orphans)
4. **JSON settings**: Flexible configuration without schema migrations
5. **Audit trails**: Track who invited whom and when

## Environment Setup

### Local Development

Your local database connects to Neon PostgreSQL via the DATABASE_URL.

```bash
# Push schema to database
bun --filter db push

# Open database explorer
bun --filter db studio
```

### Remote/Production

For production, you'll need the DATABASE_URL environment variable in your `.env` or `.env.local` file:

```bash
DATABASE_URL=postgresql://user:password@host/database
```

## Common Workflows

### Making Schema Changes

1. **Edit schema files** in `schema/` directory
2. **Generate migration**: `bun run generate`
3. **Apply locally**: `bun run push`
4. **Test your changes** (seriously, test them)
5. **Apply to production**: `bun run push:remote`

### Database Scripts

```bash
# Generate migrations from schema changes
bun --filter db generate

# Apply migrations to local database
bun --filter db migrate

# Push schema directly (skips migrations)
bun --filter db push

# Open Drizzle Studio (database GUI)
bun --filter db studio

# Check migration status
bun --filter db check

# Nuclear option: drop all tables
bun --filter db drop

# Seed sample data
bun --filter db seed
```

### Working with Remote Database

Add `:remote` to any command to target production:

```bash
bun --filter db push:remote     # Push to production
bun --filter db studio:remote   # View production data
bun --filter db migrate:remote  # Apply migrations to production
```

The smart configuration automatically detects environment based on the script name.

## Schema Development

### Adding New Tables

1. **Choose the right domain**: Does it belong in `user.ts` or `organization.ts`? When in doubt, create a new file.

2. **Follow naming conventions**:

   ```typescript
   export const myTable = sqliteTable("my_table", {
     id: text("id").primaryKey(),
     name: text("name").notNull(),
     createdAt: int("created_at", { mode: "timestamp" })
       .$default(() => new Date())
       .notNull(),
   });
   ```

3. **Add relations** for better query experience:

   ```typescript
   export const myTableRelations = relations(myTable, ({ one, many }) => ({
     user: one(user, {
       fields: [myTable.userId],
       references: [user.id],
     }),
   }));
   ```

4. **Export from index.ts**:
   ```typescript
   export * from "./my-new-domain";
   ```

### Best Practices

- **Use TypeScript enums** for constrained values
- **Add proper foreign keys** with cascade behavior
- **Include timestamps** on everything (future you will thank present you)
- **Write meaningful comments** especially for complex JSON columns
- **Test your schemas** with real data before deploying

## Importing Schemas

Thanks to our package.json exports, you can import schemas cleanly:

```typescript
// Import everything
import * as Db from "@/db/schema";
import * as Db from "../db/schema";

// Import specific schemas
import { user, organization } from "@/db/schema";

// Import individual tables
import { user } from "@/db/schema/user";
import { member, invite } from "@/db/schema/organization";
```

## Troubleshooting

### Database Connection Issues

Verify your DATABASE_URL is correctly configured and the Neon database is accessible.

### Migration Conflicts

If you're getting migration conflicts, check the `migrations/` directory. Sometimes you need to resolve them manually (or start fresh with `drop` and `push`).

### Remote Connection Issues

Verify your DATABASE_URL is correct and the Neon database exists in your Neon dashboard.

## Database Seeding

We include a seeding system for development data. Seeds live in `seeds/` and are numbered for execution order:

```bash
# Run all seeds
bun --filter db seed

# Seeds are executed in numerical order:
# 01-users.ts -> 02-workspaces.ts -> etc.
```

## Performance Considerations

- **Indexes**: PostgreSQL provides robust indexing capabilities
- **Queries**: Use Drizzle's query builder for optimal performance
- **Batch operations**: Use transactions for multiple related operations
- **Edge deployment**: Hyperdrive provides connection pooling and caching at the edge

## Contributing

When adding new features:

1. **Update schemas** thoughtfully
2. **Add proper relations**
3. **Generate migrations**
4. **Update seed data** if needed
5. **Test locally** before pushing
6. **Document breaking changes**

Remember: databases are like fine wine or questionable leftovers 🍷 they get better with age, but sometimes you need to throw them out and start fresh.

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Cloudflare Hyperdrive Documentation](https://developers.cloudflare.com/hyperdrive/)
- [Better Auth Database Guide](https://www.better-auth.com/docs/concepts/database)

---

> _The database is the foundation of your application. Build it well, or spend your weekends debugging it._  
> — 🍶 Ancient Developer Proverb
