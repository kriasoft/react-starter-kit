# Database Layer

Database layer using [Drizzle ORM](https://orm.drizzle.team/) and PostgreSQL ([Neon](https://neon.tech/) or similar) via Cloudflare Hyperdrive.

## Layout

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

```
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Running Commands

From the repo root:

```bash
# Use the workspace name
bun --filter @repo/db push       # Apply schema (drizzle-kit push)
bun --filter @repo/db migrate    # Run pending migrations
bun --filter @repo/db generate   # Generate migration from schema changes
bun --filter @repo/db studio     # Open Drizzle Studio
bun --filter @repo/db seed       # Run seed scripts
bun --filter @repo/db check      # Drift check
bun --filter @repo/db drop       # Drop all tables (destructive)
```

Or from inside `db/`:

```bash
cd db
bun run push
```

## Targeting Staging/Prod

Scripts with suffixes set `ENVIRONMENT` for you:

```bash
bun --filter @repo/db push:staging    # Uses .env.staging.local → .env.local → .env
bun --filter @repo/db push:prod       # Uses .env.prod.local   → .env.local → .env
bun --filter @repo/db seed:prod
bun --filter @repo/db studio:prod
```

You can also override with `ENVIRONMENT=prod bun --filter @repo/db push`.

## Typical Workflow

1. Update schema in `db/schema`.
2. Generate a migration: `bun --filter @repo/db generate --name <migration-name>`.
3. Apply locally: `bun --filter @repo/db migrate` (or `push` if you prefer schema sync).
4. Validate in Drizzle Studio: `bun --filter @repo/db studio`.
5. Apply to staging/prod with the matching `:staging` or `:prod` scripts.

## Seeding

- Seeds live in `db/seeds/` (currently `users.ts`).
- Run locally: `bun --filter @repo/db seed`.
- Run against another environment: `bun --filter @repo/db seed:staging` or `seed:prod`.

## Importing Schemas

Thanks to package exports you can import cleanly:

```typescript
import * as Db from "@/db/schema";
import { user } from "@/db/schema/user";
import { organization, member } from "@/db/schema/organization";
```

## Troubleshooting

- Missing URL: ensure `DATABASE_URL` is set and starts with `postgres://` or `postgresql://`.
- Wrong environment: confirm `ENVIRONMENT`/`NODE_ENV` matches the target and the corresponding `.env.*` file exists.
- Drift/conflicts: run `bun --filter @repo/db check`; regenerate migrations if schema and migrations diverge.

## UUID v7

The schema uses `gen_random_uuid()` by default for maximum compatibility. For time-ordered UUIDs (better index locality), replace with:

- **PostgreSQL 18+**: `uuidv7()` (native)
- **Earlier versions**: `uuid_generate_v7()` (requires [pg_uuidv7](https://github.com/fboulnois/pg_uuidv7) extension

```typescript
// Example: enable UUID v7 in schema
id: text()
  .primaryKey()
  .default(sql`uuidv7()`);
```
