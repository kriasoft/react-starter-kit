---
url: /getting-started/environment-variables.md
---

# Environment Variables

## File Conventions

The project uses [Vite's env file](https://vite.dev/guide/env-and-mode#env-files) convention:

| File                    | Committed | Purpose                                               |
| ----------------------- | --------- | ----------------------------------------------------- |
| `.env`                  | Yes       | Shared defaults (placeholder values, no real secrets) |
| `.env.local`            | No        | Local overrides with real credentials                 |
| `.env.staging.local`    | No        | Staging-specific overrides                            |
| `.env.production.local` | No        | Production-specific overrides                         |

`.env.local` takes precedence over `.env`. Create it by copying `.env` and filling in real values:

```bash
cp .env .env.local
```

::: warning
Never put real secrets in `.env` – it's committed to git. Use `.env.local` for anything sensitive.
:::

## Cloudflare Worker Bindings

In production, environment variables are set as Worker secrets or bindings – not from `.env` files. Configure them in the Cloudflare dashboard or via Wrangler:

```bash
wrangler secret put BETTER_AUTH_SECRET
```

Database connections use [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) bindings (`HYPERDRIVE_CACHED`, `HYPERDRIVE_DIRECT`) instead of raw connection strings. See [Deployment](/deployment/) for production setup.

For local development, Wrangler reads Hyperdrive connection strings from the `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_*` variables in `.env` / `.env.local`.

## Variable Reference

### Application

| Variable               | Required | Description                                     |
| ---------------------- | -------- | ----------------------------------------------- |
| `APP_NAME`             | Yes      | Display name used in emails and passkey prompts |
| `APP_ORIGIN`           | Yes      | Full origin URL (e.g., `http://localhost:5173`) |
| `API_ORIGIN`           | Yes      | API server URL (e.g., `http://localhost:8787`)  |
| `ENVIRONMENT`          | Yes      | `development`, `staging`, or `production`       |
| `GOOGLE_CLOUD_PROJECT` | Yes      | Google Cloud project ID (exposed to frontend)   |

### Database

| Variable                                                          | Required | Description                                |
| ----------------------------------------------------------------- | -------- | ------------------------------------------ |
| `DATABASE_URL`                                                    | Yes      | PostgreSQL connection string               |
| `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_CACHED` | Dev only | Hyperdrive cached connection for local dev |
| `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_DIRECT` | Dev only | Hyperdrive direct connection for local dev |

### Authentication

| Variable               | Required | Description                                                                           |
| ---------------------- | -------- | ------------------------------------------------------------------------------------- |
| `BETTER_AUTH_SECRET`   | Yes      | Secret for signing sessions and tokens. Generate with `bunx @better-auth/cli secret`  |
| `GOOGLE_CLIENT_ID`     | Yes      | Google OAuth client ID ([console](https://console.cloud.google.com/apis/credentials)) |
| `GOOGLE_CLIENT_SECRET` | Yes      | Google OAuth client secret                                                            |

See [Authentication](/auth/) for provider setup details.

### AI

| Variable         | Required | Description                                             |
| ---------------- | -------- | ------------------------------------------------------- |
| `OPENAI_API_KEY` | Yes      | [OpenAI](https://platform.openai.com/) API key (AI SDK) |

### Email

| Variable            | Required | Description                                             |
| ------------------- | -------- | ------------------------------------------------------- |
| `RESEND_API_KEY`    | Yes      | [Resend](https://resend.com) API key for sending emails |
| `RESEND_EMAIL_FROM` | Yes      | Sender address (e.g., `Your App <noreply@example.com>`) |

### Billing (Optional)

Stripe billing is optional – the app works without these variables, but billing endpoints return 404.

| Variable                     | Required | Description                                |
| ---------------------------- | -------- | ------------------------------------------ |
| `STRIPE_SECRET_KEY`          | No       | Stripe API secret key                      |
| `STRIPE_WEBHOOK_SECRET`      | No       | Stripe webhook signing secret              |
| `STRIPE_STARTER_PRICE_ID`    | No       | Stripe Price ID for the Starter plan       |
| `STRIPE_PRO_PRICE_ID`        | No       | Stripe Price ID for the Pro plan (monthly) |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | No       | Stripe Price ID for the Pro plan (annual)  |

See [Billing](/billing/) for Stripe configuration.

### Cloudflare

| Variable                | Required    | Description                        |
| ----------------------- | ----------- | ---------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy only | Cloudflare account ID              |
| `CLOUDFLARE_ZONE_ID`    | Deploy only | DNS zone ID for custom domains     |
| `CLOUDFLARE_API_TOKEN`  | Deploy only | API token for Wrangler deployments |

### Analytics and Search

| Variable                | Required | Description                       |
| ----------------------- | -------- | --------------------------------- |
| `GA_MEASUREMENT_ID`     | No       | Google Analytics 4 measurement ID |
| `ALGOLIA_APP_ID`        | No       | Algolia application ID            |
| `ALGOLIA_ADMIN_API_KEY` | No       | Algolia admin API key             |
