---
url: /database.md
---
# Database

The `db/` workspace manages the data layer with [Drizzle ORM](https://orm.drizzle.team/) and [Neon PostgreSQL](https://neon.tech/). In production, [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) pools and caches connections at the edge.

## Workspace Structure

```bash
db/
├── schema/             # Table definitions and relations
├── migrations/         # Auto-generated SQL migrations
├── seeds/              # Seed data scripts
├── scripts/            # Utilities (seed runner, export, introspect)
├── drizzle.config.ts   # Drizzle Kit configuration
└── index.ts            # Re-exports schema + DatabaseSchema type
```

Schema files are organized by domain – one file per entity group (e.g., `user.ts` contains the user, session, identity, and verification tables). All tables are re-exported from `schema/index.ts`.

## Connection Architecture

The API worker connects to Neon through Cloudflare Hyperdrive, which provides connection pooling and optional query caching at the edge.

Two Hyperdrive bindings are available:

| Binding             | Cache            | Use for                                                 |
| ------------------- | ---------------- | ------------------------------------------------------- |
| `HYPERDRIVE_CACHED` | 60 s query cache | Read-heavy queries where slight staleness is acceptable |
| `HYPERDRIVE_DIRECT` | None             | Writes, real-time reads, anything requiring fresh data  |

Both are exposed in [tRPC context](/api/context) as `ctx.db` (cached) and `ctx.dbDirect` (direct):

```ts
// apps/api/lib/db.ts (simplified)
export function createDb(hyperdrive: Hyperdrive) {
  const client = postgres(hyperdrive.connectionString, {
    max: 1, // single connection per Worker isolate
    prepare: false, // required for Hyperdrive compatibility
  });
  return drizzle(client, { schema, casing: "snake_case" });
}
```

::: info
In development, the API server connects directly via `DATABASE_URL` without Hyperdrive. The connection setup is transparent – your queries work the same way in both environments.
:::

## Commands

Run from the repo root. Append `:staging` or `:prod` to target other environments.

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `bun db:generate` | Generate migration SQL from schema changes    |
| `bun db:migrate`  | Apply pending migrations                      |
| `bun db:push`     | Push schema directly (skips migration files)  |
| `bun db:studio`   | Open Drizzle Studio browser UI                |
| `bun db:seed`     | Run seed scripts                              |
| `bun db:check`    | Check for drift between schema and migrations |
| `bun db:export`   | Export database via pg\_dump to `db/backups/`  |

## Environment Targeting

Database scripts select the environment through the `ENVIRONMENT` variable (falls back to `NODE_ENV`). Each environment loads env files in priority order:

```
.env.{env}.local  →  .env.local  →  .env
```

For example, `bun db:push:staging` loads `.env.staging.local` first. The `DATABASE_URL` variable must be a valid `postgres://` or `postgresql://` connection string.

See [Environment Variables](/getting-started/environment-variables) for full details.

## Importing Schemas

The `@repo/db` package exports two entry points:

```ts
import * as schema from "@repo/db"; // full schema + DatabaseSchema type
import { user, session } from "@repo/db/schema"; // individual tables
```
