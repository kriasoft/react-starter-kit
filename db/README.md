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

- In development, `DATABASE_URL` is loaded from the repo root in this order: `.env.<environment>.local` → `.env.local` → `.env`.
- Environment selection: `ENVIRONMENT` takes priority, otherwise `NODE_ENV=production|staging|test` maps directly to the same name; default is `dev`.

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
bun db:check      # Check generated migration history for conflicts
```

Append `:staging` or `:production` to target other environments. These read only `.env.<environment>.local`, override anything already exported, and fail if that file is missing:

```bash
bun db:migrate:staging
bun db:migrate:production
bun db:studio:production
bun db:export:production
```

`db:generate` and `db:push` have no remote variants – `generate` never touches a database, and `push` skips migration files, so it belongs to local prototyping only. `db:seed` stops at `:staging`; the seeds create test accounts.

## Typical Workflow

1. Update schema in `db/schema`.
2. Generate a migration: `bun db:generate --name <migration-name>`.
3. Apply locally: `bun db:migrate` (or `db:push` for schema sync).
4. Validate in Drizzle Studio: `bun db:studio`.
5. Apply to staging/production with the matching `:staging` or `:production` suffix.

## Importing Schemas

```typescript
import { schema } from "@repo/db";
import { user } from "@repo/db/schema/user";
import { organization, member } from "@repo/db/schema/organization";
```

## ID Generation

Primary keys use application-generated prefixed CUID2 IDs (e.g. `usr_ght4k2jxm7pqbv01`) via `$defaultFn()`: `generateAuthId(model)` for Better Auth models and `generateId("xxx")` for domain tables. See `db/schema/id.ts` for the prefix map.
