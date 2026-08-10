# Database

The `db/` workspace manages the data layer with [Drizzle ORM](https://orm.drizzle.team/) and [Neon PostgreSQL](https://neon.tech/). In production, [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) pools and caches connections at the edge.

## Workspace Structure

```bash
db/
├── schema/             # Table definitions and relations
├── migrations/         # Auto-generated SQL migrations
├── seeds/              # Seed data scripts
├── scripts/            # Utilities (seed runner, export)
├── drizzle.config.ts   # Drizzle Kit configuration
└── index.ts            # Re-exports schema + DatabaseSchema type
```

Schema files are organized by domain – one file per entity group (e.g., `user.ts` contains the user, session, identity, and verification tables). All tables are re-exported from `schema/index.ts`.

## Connection Architecture

The API worker connects to Neon through Cloudflare Hyperdrive, which provides connection pooling and optional query caching at the edge.

Two Hyperdrive bindings are available:

| Binding | Cache | Use for |
| --- | --- | --- |
| `HYPERDRIVE_CACHED` | 60 s + 15 s stale by default | Read-heavy queries where staleness is acceptable |
| `HYPERDRIVE_UNCACHED` | None | Writes and anything requiring fresh data |

Both are exposed in [tRPC context](/api/context) as `ctx.db` (uncached) and `ctx.dbCached` (cached). Better Auth uses `db`, since a stale session or role row would outlive a sign-out or permission change:

```ts
// apps/api/lib/db.ts (simplified)
export function createDb(hyperdrive: Hyperdrive) {
  const client = postgres(hyperdrive.connectionString, {
    max: 1, // two clients per request share the connection budget
  });
  return drizzle(client, { schema, casing: "snake_case" });
}
```

::: info

In development, Wrangler's `getPlatformProxy()` emulates the Hyperdrive bindings locally, resolving each from its own `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_*` variable in `.env` – not from `DATABASE_URL`, which is read by the Drizzle tooling in `db/` and nothing else. Local bindings connect straight to Postgres, so neither pooling nor query caching is active. Your code uses the same `HYPERDRIVE_CACHED` / `HYPERDRIVE_UNCACHED` bindings in both environments – no conditional connection logic needed.

:::

## Commands

Run from the repo root. Some take a `:staging` or `:production` suffix to target another environment – see [Environment Targeting](#environment-targeting) for which, and why the rest do not.

| Command            | Description                                         |
| ------------------ | --------------------------------------------------- |
| `bun db:generate`  | Generate migration SQL from schema changes          |
| `bun db:migrate`   | Apply pending migrations                            |
| `bun db:push`      | Push schema directly (skips migration files)        |
| `bun db:studio`    | Open Drizzle Studio browser UI                      |
| `bun db:seed`      | Run seed scripts                                    |
| `bun db:check`     | Check generated migration history for conflicts     |
| `bun db:export`    | Export database via pg_dump to `db/backups/`        |
| `bun db:typecheck` | Run TypeScript type-checking on the `db/` workspace |

## Environment Targeting

Database scripts select the environment through the `ENVIRONMENT` variable (falls back to `NODE_ENV`). Development cascades through env files, first value wins:

```
.env.dev.local  →  .env.local  →  .env
```

Staging and production do not cascade. `bun db:migrate:production` reads `.env.production.local` and only that file, and those values override anything already exported. If the file is missing the command fails instead of falling through, so an environment-named command can never end up on another environment's database.

Not every command has `:staging` and `:production` variants, by design:

| Command | Remote variants | Why |
| --- | --- | --- |
| `db:migrate`, `db:studio`, `db:export` | Yes | Applying migrations, inspecting and backing up are real remote operations |
| `db:seed` | `:staging` only | Seeds create test accounts – they have no business in production |
| `db:generate` | No | Reads the schema and existing migrations; it never connects to a database |
| `db:push` | No | Syncs schema without a migration file – prototyping only, never deployed |

The `DATABASE_URL` variable must be a valid `postgres://` or `postgresql://` connection string.

See [Environment Variables](/getting-started/environment-variables) for full details.

## Importing Schemas

The `@repo/db` package exports two entry points:

```ts
import * as schema from "@repo/db"; // full schema + DatabaseSchema type
import { user, session } from "@repo/db/schema"; // individual tables
```
