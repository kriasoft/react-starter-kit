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

Staging and production each have their own Wrangler configuration, Hyperdrive bindings, and Terraform workspace. Development is local and provisions no cloud resources. See [CI/CD](/deployment/ci-cd) for deployment triggers. The checked-in deployment step is disabled until Cloudflare credentials are configured.

## Deployment Checklist

1. **Provision infrastructure** – run Terraform to create the Hyperdrive configurations. Workers, routes and the custom domain's DNS come from Wrangler at deploy time ([ADR-002](/adr/002-terraform-wrangler-boundary))
2. **Set secrets** – configure `BETTER_AUTH_SECRET` and `RESEND_API_KEY`, plus secrets for any optional integrations you enable, via Wrangler. See [Cloudflare Workers](/deployment/cloudflare) for the full list
3. **Run migrations** – apply schema to your production database. See [Production Database](/deployment/production-database)
4. **Build and deploy** – push code to workers. See [CI/CD](/deployment/ci-cd) or deploy manually:

```bash
bun run build        # Build all deployable workspaces
bun api:deploy --env="" # Deploy production API worker
bun app:deploy --env="" # Deploy production App worker
bun web:deploy --env="" # Deploy production Web worker
```

## Section Pages

- [Cloudflare Workers](/deployment/cloudflare) – Wrangler config, secrets, build and deploy
- [Production Database](/deployment/production-database) – Neon setup, Hyperdrive, running migrations
- [CI/CD](/deployment/ci-cd) – GitHub Actions pipelines, verifying pull requests
- [Monitoring](/deployment/monitoring) – Logs, analytics, rollbacks, troubleshooting
