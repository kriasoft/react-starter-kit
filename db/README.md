# Database Layer

Database layer using [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL ([Neon](https://neon.tech/)) via Cloudflare Hyperdrive.

[Documentation](https://reactstarter.com/database/) | [Schema](https://reactstarter.com/database/schema) | [Migrations](https://reactstarter.com/database/migrations)

## Structure

```bash
db/
├── schema/             # Table definitions and relations
├── migrations/         # Auto-generated migration files
├── seeds/              # Seed scripts (e.g., users)
├── scripts/            # DB utilities (seed/export)
├── drizzle.config.ts   # Drizzle configuration
└── package.json        # DB-only scripts and deps
```

## Environment

- `DATABASE_URL` is required and loaded from repo root: `.env.<environment>.local` → `.env.local` → `.env`.
- Environment selection: `ENVIRONMENT` takes priority, otherwise `NODE_ENV=production|staging|test` falls back to `prod|staging|test`; default is `dev`.

Example `.env.dev.local` (at repo root):

```txt
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Commands

From the repo root:

```bash
bun db:push       # Apply schema (drizzle-kit push)
bun db:generate   # Generate migration from schema changes
bun db:migrate    # Run pending migrations
bun db:studio     # Open Drizzle Studio
bun db:seed       # Run seed scripts
bun db:check      # Drift check
```

Append `:staging` or `:prod` to target other environments:

```bash
bun db:push:staging        # Uses .env.staging.local → .env.local → .env
bun db:push:prod           # Uses .env.prod.local   → .env.local → .env
bun db:seed:prod
bun db:studio:prod
```

## Typical Workflow

1. Update schema in `db/schema`.
2. Generate a migration: `bun db:generate --name <migration-name>`.
3. Apply locally: `bun db:migrate` (or `db:push` for schema sync).
4. Validate in Drizzle Studio: `bun db:studio`.
5. Apply to staging/prod with the matching `:staging` or `:prod` suffix.

## Importing Schemas

```typescript
import { schema } from "@repo/db";
import { user } from "@repo/db/schema/user";
import { organization, member } from "@repo/db/schema/organization";
```

## ID Generation

All primary keys use application-generated prefixed CUID2 IDs (e.g. `usr_ght4k2jxm7pqbv01`). IDs are generated at the application level via `$defaultFn()` -- no database-level defaults. See `db/schema/id.ts` for the prefix map.
