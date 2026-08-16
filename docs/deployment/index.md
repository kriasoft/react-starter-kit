# Deployment

React Starter Kit deploys as three Cloudflare Workers backed by a Neon PostgreSQL database. Infrastructure is managed with Terraform.

## What Gets Deployed

| Component | Target | Description |
| --- | --- | --- |
| **Web Worker** | Cloudflare Workers | Edge router – receives all traffic, routes to app/api via service bindings |
| **App Worker** | Cloudflare Workers | Serves the React SPA and static assets |
| **API Worker** | Cloudflare Workers | Hono + tRPC server, authentication, database access |
| **Database** | Neon PostgreSQL | Managed Postgres with Hyperdrive connection pooling |
| **Infrastructure** | Terraform | Hyperdrive configurations, optional R2 storage |

See [Architecture Overview](/architecture/) for how these components connect.

## Prerequisites

- **Cloudflare account** with Workers enabled
- **Neon account** for PostgreSQL hosting ([sign up](https://get.neon.com/HD157BR))
- **Terraform** installed (`brew install terraform` or [download](https://developer.hashicorp.com/terraform/install))
- **Domain** added to Cloudflare DNS (optional for initial setup)

## Environments

| Environment | Intended trigger | URL pattern | Purpose |
| --- | --- | --- | --- |
| Development | `bun dev` | `localhost:5173` | Local development |
| Staging | Push to `main` | `staging.example.com` | Pre-production validation |
| Production | Manual dispatch | `example.com` | Live environment |

Staging and production each have their own Wrangler configuration, Hyperdrive bindings, and Terraform workspace. Development is local and provisions no cloud resources. See [CI/CD](/deployment/ci-cd) for deployment triggers. Automated deploys stay off until you set the `DEPLOY_ENABLED` repository variable, so a fresh clone runs CI only.

## Deployment Checklist

1. **Provision infrastructure** – run Terraform to create the Hyperdrive configurations. Workers, routes and the custom domain's DNS come from Wrangler at deploy time ([ADR-002](/adr/002-terraform-wrangler-boundary))
2. **Set secrets** – configure `BETTER_AUTH_SECRET` and `RESEND_API_KEY`, plus secrets for any optional integrations you enable, via Wrangler. See [Cloudflare Workers](/deployment/cloudflare) for the full list
3. **Build and verify** – compile every workspace, prove each worker bundles, and confirm the Cloudflare identity and production account, all before anything changes
4. **Run migrations** – apply the schema to your production database. See [Production Database](/deployment/production-database)
5. **Deploy the workers** – `api`, then `app`, then `web`. Service bindings resolve by name at deploy time, and `web` holds the public route, so it flips last

Steps 3 to 5 are what an automated release does; push to `main` or dispatch a production run and [CI/CD](/deployment/ci-cd) handles them. To do it by hand:

```bash
# Preflight – nothing here changes production
bun run build

bun wrangler deploy --config apps/api/wrangler.jsonc --env="" --dry-run
bun wrangler deploy --config apps/app/wrangler.jsonc --env="" --dry-run
bun wrangler deploy --config apps/web/wrangler.jsonc --env="" --dry-run

# `--dry-run` never authenticates, so confirm the account separately
bun wrangler whoami --account <production-account-id>
```

Stop unless every command succeeded and `whoami` reports the account you meant. These are two blocks rather than one because an interactive shell does not stop on error – pasted together, a failed dry-run would scroll past and the migration would still run.

```bash
# Point of no return
bun db:migrate:production

bun api:deploy --env=""
bun app:deploy --env=""
bun web:deploy --env=""
```

The order matters for the same reason it does in CI: migrations run against workers that are still the old ones, so a schema change has to be [additive](/deployment/ci-cd#release-order) until the new workers are live.

## Section Pages

- [Cloudflare Workers](/deployment/cloudflare) – Wrangler config, secrets, build and deploy
- [Production Database](/deployment/production-database) – Neon setup, Hyperdrive, running migrations
- [CI/CD](/deployment/ci-cd) – GitHub Actions pipelines, verifying pull requests
- [Monitoring](/deployment/monitoring) – Logs, analytics, rollbacks, troubleshooting
