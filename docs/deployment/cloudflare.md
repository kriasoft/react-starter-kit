# Cloudflare Workers

Each app has its own `wrangler.jsonc` with per-environment configuration for variables, service bindings, and Hyperdrive.

## Wrangler Configuration

The **web** worker is the edge router. It receives all traffic via route patterns and forwards requests to **app** and **api** workers through service bindings:

```jsonc
// apps/web/wrangler.jsonc (simplified)
{
  "name": "example-web",
  "routes": [{ "pattern": "example.com", "custom_domain": true }],
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

The **api** worker has `nodejs_compat` enabled and connects to Neon through two Hyperdrive bindings (cached and uncached):

```jsonc
// apps/api/wrangler.jsonc (simplified)
{
  "name": "example-api",
  "compatibility_flags": ["nodejs_compat"],
  "hyperdrive": [
    { "binding": "HYPERDRIVE_CACHED", "id": "your-hyperdrive-cached-id" },
    { "binding": "HYPERDRIVE_UNCACHED", "id": "your-hyperdrive-uncached-id" },
  ],
}
```

The **app** worker serves the SPA with `not_found_handling: "single-page-application"` so all routes resolve to `index.html`.

::: info

Service bindings are non-inheritable in Wrangler – each environment (`dev`, `staging`) must declare its own `services` array with the correct worker names (e.g., `example-app-staging`).

:::

::: warning

Wrangler is the only source of worker names – each app's `name`, plus `-{environment}` for named environments. Keep all three names and the web worker's service targets aligned, or a service binding will resolve to the wrong worker. Terraform's `project_slug` names the Hyperdrive configurations, so it should match the same prefix. All defaults use `example`; rename them together.

:::

See [Architecture: Edge](/architecture/edge) for details on the service binding model.

## Environment Variables

Each worker declares `vars` per environment in `wrangler.jsonc`. The API worker has the most:

| Variable            | Worker | Description                                   |
| ------------------- | ------ | --------------------------------------------- |
| `ENVIRONMENT`       | all    | `development`, `staging`, `production`        |
| `APP_NAME`          | api    | Display name used in emails                   |
| `APP_ORIGIN`        | api    | Full origin URL (e.g., `https://example.com`) |
| `RESEND_EMAIL_FROM` | api    | Sender address for transactional emails       |

::: danger

Change `RESEND_EMAIL_FROM` before your first real users. Every environment ships with `onboarding@resend.dev`, Resend's shared testing sender. It only delivers to the address that owns your API key – any other recipient gets a `403`. Because sign-in is email OTP, a deploy that leaves it in place looks completely healthy while nobody but you can actually sign in. [Verify a domain](https://resend.com/domains), then set the sender to an address on it.

:::

There is no CORS configuration because there are no cross-origin requests: the browser only ever talks to the web worker, which reaches the API over a service binding. Sending no CORS headers is what keeps another origin from reading API responses – the browser's same-origin policy does the work.

Better Auth additionally validates `Origin` and `callbackURL` against `trustedOrigins` (set from `APP_ORIGIN`), but only for its own `/api/auth/*` endpoints. tRPC routes have no origin check of their own. If you move the API to a separate hostname, adding CORS is not sufficient – the tRPC routes then need CSRF protection too, since they rely on being same-origin today.

See [Environment Variables](/getting-started/environment-variables) for the complete reference.

## Secrets

Secrets are set per worker via the Wrangler CLI. For the API worker:

```bash
# Generate a secret for Better Auth
bunx auth@latest secret

# Required. Add --env staging for that environment; production is the
# top-level config, selected explicitly with --env="".
bun wrangler secret put BETTER_AUTH_SECRET --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put RESEND_API_KEY --config apps/api/wrangler.jsonc --env=""

# Google sign-in — optional, but set both or neither
bun wrangler secret put GOOGLE_CLIENT_ID --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put GOOGLE_CLIENT_SECRET --config apps/api/wrangler.jsonc --env=""

# AI features — optional
bun wrangler secret put OPENAI_API_KEY --config apps/api/wrangler.jsonc --env=""

# Billing — optional, but set all four or none
bun wrangler secret put STRIPE_SECRET_KEY --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put STRIPE_WEBHOOK_SECRET --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put STRIPE_STARTER_PRICE_ID --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put STRIPE_PRO_PRICE_ID --config apps/api/wrangler.jsonc --env=""
bun wrangler secret put STRIPE_PRO_ANNUAL_PRICE_ID --config apps/api/wrangler.jsonc --env="" # optional
```

::: warning

Set all four Stripe values or none. A partial configuration throws when authentication initializes, naming the missing keys, rather than quietly leaving `/api/auth/subscription/*` on 404. `STRIPE_PRO_ANNUAL_PRICE_ID` is independently optional. See [Billing: Plans](/billing/plans).

:::

Every command carries `--config` because a secret binds to whichever worker the config names – run one from the repository root without it and Wrangler has no worker to attach it to.

Only `BETTER_AUTH_SECRET` and `RESEND_API_KEY` are mandatory – the app cannot sign anyone in without them. `apps/api/wrangler.jsonc` lists exactly those two under `secrets.required`, so a deploy missing either fails immediately. Google sign-in, OpenAI and Stripe are optional and stay out of that list, because requiring them would block deploys for anyone not using them. Running `secret put` against a worker that does not exist yet is fine – Wrangler offers to create an empty placeholder to hold the secret, which the deploy then overwrites.

## Build and Deploy

Email templates must compile before the API worker bundles them. The root build script lets Bun order that workspace dependency while independent builds can run in parallel:

```bash
# Build every deployable workspace
bun run build          # Build all deployable workspaces

# Deploy each worker
bun api:deploy --env=""
bun app:deploy --env=""
bun web:deploy --env=""

# Or deploy to a specific environment
bun wrangler deploy --config apps/api/wrangler.jsonc --env staging
bun wrangler deploy --config apps/app/wrangler.jsonc --env staging
bun wrangler deploy --config apps/web/wrangler.jsonc --env staging
```

## Custom Domain

1. Add your domain to Cloudflare and update nameservers at your registrar
2. Update `routes` in `apps/web/wrangler.jsonc` with your domain
3. Set SSL/TLS encryption mode to **Full (strict)** in the Cloudflare dashboard
4. Enable **Always Use HTTPS**

The `web` worker is the origin for the whole hostname, so it uses a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) rather than a route:

```jsonc
"routes": [{ "pattern": "example.com", "custom_domain": true }]
```

Wrangler creates the DNS record and certificate on deploy, so Terraform owns no DNS and its API token needs no zone permissions. The pattern must be a bare hostname – no `/*` and no `zone_name`. Wrangler refuses to attach a custom domain while a conflicting DNS record exists, so remove any record you created for that hostname first.

To serve a second worker from a path on the same hostname, switch back to plain `routes` with `zone_name` and create a proxied placeholder record yourself. See [ADR-002](/adr/002-terraform-wrangler-boundary).

## Infrastructure with Terraform

Terraform creates the Hyperdrive configurations. Everything about the workers themselves – names, code, routes, custom domains – belongs to Wrangler ([ADR-002](/adr/002-terraform-wrangler-boundary)).

```bash
# One-time, per environment
bun infra:staging init

# Plan, then apply
bun infra:staging plan
bun infra:staging apply
```

Each environment is its own Terraform root and HCP Terraform workspace, in `infra/envs/{staging,production}/`. There is no `dev` root – local development provisions nothing. See [`infra/README.md`](https://github.com/kriasoft/react-starter-kit/blob/main/infra/README.md) for workspace setup and API token scopes.
