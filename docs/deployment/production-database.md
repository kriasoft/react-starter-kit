# Production Database

The production database runs on [Neon PostgreSQL](https://neon.tech/) with [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) providing connection pooling at the edge.

## Neon Setup

1. Create a Neon project at [console.neon.tech](https://console.neon.tech/) (or via [referral](https://get.neon.com/HD157BR))
2. Create separate databases for staging and production (or use Neon branching)
3. Copy the connection strings – you'll need them for Hyperdrive and migrations

The connection string format: `postgresql://user:pass@host/dbname?sslmode=require`

## Hyperdrive Configuration

Hyperdrive is provisioned via Terraform. The module in `infra/modules/cloudflare/` splits the connection string into the fields Hyperdrive stores, and creates two configurations per environment:

```bash
# Provision Hyperdrive for staging
bun infra:staging apply
```

| Binding | Caching | Use for |
| --- | --- | --- |
| `HYPERDRIVE_CACHED` | 60s, 15s stale | Reads that tolerate being briefly stale |
| `HYPERDRIVE_UNCACHED` | Disabled | Writes, and reads that must not be stale (auth, billing) |

Terraform sets both values explicitly rather than inheriting them, so the window above is the reviewable source – see [Infrastructure](/specs/infra-terraform). A cached result can therefore be 75 seconds old, and a write never invalidates it: read-after-write, session, and permission checks belong on `HYPERDRIVE_UNCACHED`.

Give Hyperdrive Neon's **unpooled** connection string – the host without `-pooler`. Hyperdrive is itself the pool; Neon's runs in transaction mode, which breaks the prepared statements Hyperdrive caches on, and adds a second layer competing for the same connection budget. Both configurations open up to `origin_connection_limit` connections each, so the database must allow at least twice that.

Then copy the IDs into `apps/api/wrangler.jsonc` for the matching environment:

```bash
bun infra:staging output -raw wrangler_hyperdrive_bindings
```

See [Database: Connection Architecture](/database/#connection-architecture) for how these bindings are used in application code.

## Running Migrations

Migrations run directly against Neon (not through Hyperdrive). The `db/` workspace provides environment-specific commands:

```bash
# Staging
bun db:migrate:staging

# Production
bun db:migrate:production
```

Each command reads only its own file – `.env.staging.local` or `.env.production.local` – and fails if that file is missing or does not define `DATABASE_URL`, rather than falling back to another environment's connection string. See [Database: Migrations](/database/migrations) for the full workflow.

::: warning

Review the SQL in `db/migrations/` before applying it to production. Those files are generated during development with `bun db:generate` and committed, so the exact statements are visible in the pull request that introduced them.

:::

## Database Performance

Neon suspends idle compute after a period of inactivity, so the first request after a quiet spell pays a cold start. Expect it on staging and on low-traffic production deployments before attributing the latency to Hyperdrive or the worker.

The shipped tables already index `organizationId` on `member` and `invitation`. Do the same on your own tenant-scoped tables: every scoped query filters on that column, so a missing index there costs more than anywhere else in the schema.
