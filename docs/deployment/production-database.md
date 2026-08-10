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

Use `HYPERDRIVE_CACHED` only where a result from the configured cache window is acceptable. With the defaults above, a result can be up to 75 seconds old and writes do not invalidate it. Read-after-write, session, and permission checks therefore belong on `HYPERDRIVE_UNCACHED`.

Give Hyperdrive Neon's **unpooled** connection string – the host without `-pooler`. Hyperdrive is itself the pool, and stacking two exhausts connections under load. Both configurations open up to `origin_connection_limit` connections each, so the database must allow at least twice that.

Then copy the IDs into `apps/api/wrangler.jsonc` for the matching environment:

```bash
bun infra:staging workspace show    # must end in -staging
bun infra:staging output -raw wrangler_hyperdrive_bindings
```

::: warning

`output` reads values out of state instead of recomputing them, so the workspace guard that protects `plan` and `apply` does not run here. With a stale `TF_WORKSPACE` exported, this prints the _other_ environment's IDs – and pasting those into a `wrangler.jsonc` points that worker at the wrong database. Confirm the workspace first.

:::

See [Database: Connection Architecture](/database/#connection-architecture) for how these bindings are used in application code.

## Running Migrations

Migrations run directly against Neon (not through Hyperdrive). The `db/` workspace provides environment-specific commands:

```bash
# Staging
bun db:migrate:staging

# Production
bun db:migrate:production
```

These commands read connection strings from `.env.staging.local` and `.env.production.local` respectively. See [Database: Migrations](/database/migrations) for the full workflow.

::: warning

Always review generated migration SQL before running against production. Use `bun db:generate` to preview changes, then inspect the files in `db/migrations/` before applying.

:::

## Database Performance

- **Connection pooling** – Hyperdrive maintains a pool at the edge, reducing cold-start latency
- **Indexes** – add indexes for frequently queried columns, especially foreign keys used in multi-tenant filters
- **Monitor slow queries** – use the Neon dashboard to identify and optimize slow queries
- **Compute auto-suspend** – Neon suspends idle compute after inactivity; first request after suspend has higher latency
