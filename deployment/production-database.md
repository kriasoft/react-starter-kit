---
url: /deployment/production-database.md
---
# Production Database

The production database runs on [Neon PostgreSQL](https://neon.tech/) with [Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) providing connection pooling at the edge.

## Neon Setup

1. Create a Neon project at [console.neon.tech](https://console.neon.tech/) (or via [referral](https://get.neon.com/HD157BR))
2. Create separate databases for staging and production (or use Neon branching)
3. Copy the connection strings – you'll need them for Hyperdrive and migrations

The connection string format: `postgresql://user:pass@host/dbname?sslmode=require`

## Hyperdrive Configuration

Hyperdrive is provisioned via Terraform. The module in `infra/modules/cloudflare/hyperdrive/` parses the Neon connection string and creates a Hyperdrive config with connection pooling:

```bash
# Provision Hyperdrive for staging
bun infra:staging:edge:apply
```

This creates two Hyperdrive bindings per environment:

| Binding             | Caching             | Use for                                            |
| ------------------- | ------------------- | -------------------------------------------------- |
| `HYPERDRIVE_CACHED` | Disabled by default | Read-heavy queries (enable in Terraform if needed) |
| `HYPERDRIVE_DIRECT` | None                | Writes, real-time reads                            |

After Terraform applies, copy the Hyperdrive IDs from the output into `apps/api/wrangler.jsonc` for each environment.

See [Database: Connection Architecture](/database/#connection-architecture) for how these bindings are used in application code.

## Running Migrations

Migrations run directly against Neon (not through Hyperdrive). The `db/` workspace provides environment-specific commands:

```bash
# Staging
bun db:migrate:staging

# Production
bun db:migrate:prod
```

These commands read connection strings from `.env.staging.local` and `.env.prod.local` respectively. See [Database: Migrations](/database/migrations) for the full workflow.

::: warning
Always review generated migration SQL before running against production. Use `bun db:generate` to preview changes, then inspect the files in `db/migrations/` before applying.
:::

## Database Performance

* **Connection pooling** – Hyperdrive maintains a pool at the edge, reducing cold-start latency
* **Indexes** – add indexes for frequently queried columns, especially foreign keys used in multi-tenant filters
* **Monitor slow queries** – use the Neon dashboard to identify and optimize slow queries
* **Compute auto-suspend** – Neon suspends idle compute after inactivity; first request after suspend has higher latency
