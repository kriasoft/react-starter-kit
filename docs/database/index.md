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
├── testing.ts          # createTestDatabase() – PGlite for tests
└── index.ts            # Re-exports schema, DatabaseSchema and Database types
```

Schema files are organized by domain – one file per entity group (e.g., `user.ts` contains the user, session, identity, and verification tables). All tables are re-exported from `schema/index.ts`, and that barrel is the only file Drizzle Kit reads: a table missing from it is invisible to `bun db:generate`, which then reports no changes rather than an error.

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

## Database Roles

The starter connects with one role, which is fine locally and worth splitting before production. Two roles per environment, with different jobs:

| Role | Used by | Privileges |
| --- | --- | --- |
| the database owner | Drizzle Kit (`DATABASE_URL`) | Owns every table; applies migrations |
| `app_{environment}` | Hyperdrive, so every Worker query | `SELECT`/`INSERT`/`UPDATE`/`DELETE` only |

The app role holds no DDL privileges – it cannot create, alter or drop anything, temporary tables included – so the schema only ever changes through a migration run with the owner credential. A SQL-injection bug that reaches the database can still read and write rows, but it cannot drop a table or add one to hide in.

`CONNECT` is revoked from `PUBLIC` on the database as well. Postgres grants it to everyone by default, so on a Neon project holding both environments a leaked staging credential could otherwise open the production database.

`db/scripts/grant-app-role.sql` creates the role and its grants, including the default privileges that cover tables future migrations add. It is idempotent, covers schema `public` only, and never rotates an existing password:

```bash
psql "$DATABASE_URL" -f db/scripts/grant-app-role.sql \
  -v role=app_staging -v password='...'
```

Run it as the owner: `ALTER DEFAULT PRIVILEGES` binds to whoever runs it, so any other runner leaves the next migration's tables unreachable by the app. The script checks that rather than trusting it, because Postgres answers a `REVOKE` the caller is not entitled to make with a warning and a successful exit – the wrong runner would otherwise report a role that looks provisioned with none of the boundary around it. It also refuses a role name that already exists with privileges of its own, since it only ever grants.

The app connection string is what Hyperdrive gets – see [Production Database](/deployment/production-database) – while `DATABASE_URL` keeps the owner credential for migrations.

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

Database scripts select the environment through the `ENVIRONMENT` variable (falls back to `NODE_ENV`). There are three: `dev`, `staging` and `production`. Development cascades through env files, first value wins:

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

`db:push` is enforced local, not merely documented as local. `db/scripts/guard-push.ts` resolves the same `DATABASE_URL` the command would use and refuses any host outside loopback, because `push` infers a schema change and applies it in place – against a database holding real rows that is a migration nobody reviewed, and it will drop a column, and its data, to make the shapes agree. The committed `.env` points at `localhost`, but the moment `.env.local` carries a hosted branch the dangerous thing becomes the easy thing.

```bash
ALLOW_REMOTE_DB_PUSH=1 bun db:push
```

That is the deliberate way past it, for a remote database that is genuinely disposable. Reaching for it by habit means it has stopped being a control.

There is deliberately no `test` environment. Tests run against [PGlite](/testing#database-tests) in-process, so they never resolve a connection string – and `ENVIRONMENT=test` fails loudly rather than falling through to whichever database `.env.local` points at.

See [Environment Variables](/getting-started/environment-variables) for full details.

## Importing Schemas

The `@repo/db` package exports three entry points:

```ts
import * as schema from "@repo/db"; // full schema + type exports
import { user, session } from "@repo/db/schema"; // individual tables
import { createTestDatabase } from "@repo/db/testing"; // test database
```

The root entry also exports `Database`, the schema-bound client type:

```ts
import type { Database } from "@repo/db";

async function findMembership(db: Database, userId: string, orgId: string) {
  return db.query.member.findFirst({
    where: (m, { and, eq }) =>
      and(eq(m.userId, userId), eq(m.organizationId, orgId)),
  });
}
```

It names the schema, not the driver – postgres-js over Hyperdrive in production, PGlite in tests – so a helper written against it works in both without a cast.
