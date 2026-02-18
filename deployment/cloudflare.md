---
url: /deployment/cloudflare.md
---
# Cloudflare Workers

Each app has its own `wrangler.jsonc` with per-environment configuration for variables, service bindings, and Hyperdrive.

## Wrangler Configuration

The **web** worker is the edge router. It receives all traffic via route patterns and forwards requests to **app** and **api** workers through service bindings:

```jsonc
// apps/web/wrangler.jsonc (simplified)
{
  "name": "example-web",
  "routes": [{ "pattern": "example.com/*", "zone_name": "example.com" }],
  "services": [
    { "binding": "APP_SERVICE", "service": "example-app" },
    { "binding": "API_SERVICE", "service": "example-api" },
  ],
  "assets": {
    "directory": "./dist",
    "run_worker_first": ["/"],
  },
}
```

The **api** worker has `nodejs_compat` enabled and connects to Neon through two Hyperdrive bindings (cached and direct):

```jsonc
// apps/api/wrangler.jsonc (simplified)
{
  "name": "example-api",
  "compatibility_flags": ["nodejs_compat"],
  "hyperdrive": [
    { "binding": "HYPERDRIVE_CACHED", "id": "your-hyperdrive-cached-id" },
    { "binding": "HYPERDRIVE_DIRECT", "id": "your-hyperdrive-direct-id" },
  ],
}
```

The **app** worker serves the SPA with `not_found_handling: "single-page-application"` so all routes resolve to `index.html`.

::: info
Service bindings are non-inheritable in Wrangler – each environment (`staging`, `preview`) must declare its own `services` array with the correct worker names (e.g., `example-app-staging`).
:::

See [Architecture: Edge](/architecture/edge) for details on the service binding model.

## Environment Variables

Each worker declares `vars` per environment in `wrangler.jsonc`. The API worker has the most:

| Variable            | Worker   | Description                                       |
| ------------------- | -------- | ------------------------------------------------- |
| `ENVIRONMENT`       | all      | `development`, `preview`, `staging`, `production` |
| `APP_NAME`          | api      | Display name used in emails                       |
| `APP_ORIGIN`        | api      | Full origin URL (e.g., `https://example.com`)     |
| `ALLOWED_ORIGINS`   | api, app | Comma-separated list for CORS                     |
| `RESEND_EMAIL_FROM` | api      | Sender address for transactional emails           |

See [Environment Variables](/getting-started/environment-variables) for the complete reference.

## Secrets

Secrets are set per worker via the Wrangler CLI. For the API worker:

```bash
# Generate a secret for Better Auth
openssl rand -hex 32

# Set secrets (repeat for each environment: --env staging, --env preview)
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

::: warning
Run `wrangler secret put` from the workspace directory (e.g., `apps/api/`) or pass `--config apps/api/wrangler.jsonc` so secrets bind to the correct worker.
:::

## Build and Deploy

Build order matters – email templates must compile before the API worker bundles them:

```bash
# Build all workspaces in dependency order
bun build              # email → web → api → app

# Deploy each worker
bun api:deploy
bun app:deploy
bun web:deploy

# Or deploy to a specific environment
bun wrangler deploy --config apps/api/wrangler.jsonc --env=staging
bun wrangler deploy --config apps/app/wrangler.jsonc --env=staging
bun wrangler deploy --config apps/web/wrangler.jsonc --env=staging
```

## Custom Domain

1. Add your domain to Cloudflare and update nameservers at your registrar
2. Update `routes` in `apps/web/wrangler.jsonc` with your domain
3. Set SSL/TLS encryption mode to **Full (strict)** in the Cloudflare dashboard
4. Enable **Always Use HTTPS**

Routes are declared in `wrangler.jsonc` and applied automatically on deploy. Terraform manages DNS records if `cloudflare_zone_id` and `hostname` are set in your environment variables.

## Infrastructure with Terraform

Terraform creates worker metadata, Hyperdrive configs, and DNS records. Worker code is deployed separately via Wrangler.

```bash
# Plan changes for staging
bun infra:staging:edge:plan

# Apply changes
bun infra:staging:edge:apply
```

Each environment has its own Terraform state in `infra/envs/{dev,preview,staging,prod}/edge/`.
