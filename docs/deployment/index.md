# Deployment

React Starter Kit deploys as three Cloudflare Workers backed by a Neon PostgreSQL database. Infrastructure is managed with Terraform.

## What Gets Deployed

| Component          | Target             | Description                                                                |
| ------------------ | ------------------ | -------------------------------------------------------------------------- |
| **Web Worker**     | Cloudflare Workers | Edge router – receives all traffic, routes to app/api via service bindings |
| **App Worker**     | Cloudflare Workers | Serves the React SPA and static assets                                     |
| **API Worker**     | Cloudflare Workers | Hono + tRPC server, authentication, database access                        |
| **Database**       | Neon PostgreSQL    | Managed Postgres with Hyperdrive connection pooling                        |
| **Infrastructure** | Terraform          | Worker metadata, Hyperdrive configs, DNS records                           |

See [Architecture Overview](/architecture/) for how these components connect.

## Prerequisites

- **Cloudflare account** with Workers enabled
- **Neon account** for PostgreSQL hosting ([sign up](https://get.neon.com/HD157BR))
- **Terraform** installed (`brew install terraform` or [download](https://developer.hashicorp.com/terraform/install))
- **Domain** added to Cloudflare DNS (optional for initial setup)

## Environments

| Environment | Trigger         | URL pattern              | Purpose                                                                      |
| ----------- | --------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Development | `bun dev`       | `localhost:5173`         | Local development                                                            |
| Preview     | Pull request    | `{codename}.example.com` | Isolated PR testing ([pr-codename](https://github.com/kriasoft/pr-codename)) |
| Staging     | Push to `main`  | `staging.example.com`    | Pre-production validation                                                    |
| Production  | Manual dispatch | `example.com`            | Live environment                                                             |

Each environment has its own Wrangler config, Hyperdrive bindings, and Terraform state. See [CI/CD](/deployment/ci-cd) for how deployments are triggered.

## Deployment Checklist

1. **Provision infrastructure** – run Terraform to create workers, Hyperdrive, and DNS records
2. **Set secrets** – configure `BETTER_AUTH_SECRET`, Stripe keys, and other secrets via Wrangler. See [Cloudflare Workers](/deployment/cloudflare) for the full list
3. **Run migrations** – apply schema to your production database. See [Production Database](/deployment/production-database)
4. **Build and deploy** – push code to workers. See [CI/CD](/deployment/ci-cd) or deploy manually:

```bash
bun build            # email → web → api → app
bun api:deploy       # Deploy API worker
bun app:deploy       # Deploy App worker
bun web:deploy       # Deploy Web worker
```

## Section Pages

- [Cloudflare Workers](/deployment/cloudflare) – Wrangler config, secrets, build and deploy
- [Production Database](/deployment/production-database) – Neon setup, Hyperdrive, running migrations
- [CI/CD](/deployment/ci-cd) – GitHub Actions pipelines, preview deployments
- [Monitoring](/deployment/monitoring) – Logs, analytics, rollbacks, troubleshooting
