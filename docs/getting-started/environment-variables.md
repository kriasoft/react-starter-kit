---
outline: [2, 3]
---

# Environment Variables

## Local Env Files

Different tools read different files; staging and production application Workers never load these files.

| File | Committed | Consumer and purpose |
| --- | --- | --- |
| `.env` | Yes | Shared local-development placeholders |
| `.env.local` | No | Vite, Astro, and local API overrides |
| `.env.dev.local` / `.env.test.local` | No | Optional Drizzle development/test overrides |
| `.env.staging.local` | No | Staging `db:*` commands; must contain `DATABASE_URL` |
| `.env.production.local` | No | Production `db:*` commands; must contain `DATABASE_URL` |
| `.env.terraform.staging` / `.env.terraform.production` | Optional | Shared HCP organization and workspace, once the repo is yours |
| `.env.terraform.staging.local` | No | Staging HCP organization and workspace selection |
| `.env.terraform.production.local` | No | Production HCP organization and workspace selection |

The Terraform pair cascades like `.env` and `.env.local`: `bun infra:staging` reads `.env.terraform.staging` then `.env.terraform.staging.local`, and the second wins. The starter commits neither, so a clone carries no deployment targets; add the committed file when you want your team to share one. Neither value is a secret – CI passes both as GitHub variables. See [Infrastructure](https://github.com/kriasoft/react-starter-kit/tree/main/infra#setup).

For normal local development, `.env.local` takes precedence over `.env`. Create it by copying `.env` and filling in real values:

```bash
cp .env .env.local
```

::: warning

Never put real secrets in `.env` – it is committed to git. Use the applicable gitignored `.local` file for anything sensitive. Database commands named for staging or production read only their matching file and fail if it is absent.

:::

## Cloudflare Worker Bindings

In production, environment variables are set as Worker secrets or bindings – not from `.env` files. Configure them in the Cloudflare dashboard or via Wrangler:

```bash
bun wrangler secret put BETTER_AUTH_SECRET --config apps/api/wrangler.jsonc --env=""
```

Database connections use [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) bindings (`HYPERDRIVE_CACHED`, `HYPERDRIVE_UNCACHED`) instead of raw connection strings. See [Deployment](/deployment/) for production setup.

For local development, Wrangler reads Hyperdrive connection strings from the `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_*` variables in `.env` / `.env.local`.

## Variable Reference

### Application

| Variable      | Required | Description                                       |
| ------------- | -------- | ------------------------------------------------- |
| `APP_NAME`    | Yes      | Display name used in emails and passkey prompts   |
| `APP_ORIGIN`  | Yes      | Full origin URL (e.g., `http://localhost:5173`)   |
| `API_ORIGIN`  | Dev only | Vite proxy target (e.g., `http://localhost:8787`) |
| `ENVIRONMENT` | Yes      | `development`, `staging`, or `production`         |

### Database

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_CACHED` | Dev only | Hyperdrive cached connection for local dev |
| `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE_UNCACHED` | Dev only | Hyperdrive uncached connection for local dev |

Use an **unpooled** connection string for all three – the Neon host without `-pooler`. The client keeps prepared statements enabled, and a transaction-mode pooler breaks them.

### Authentication

| Variable | Required | Description |
| --- | --- | --- |
| `BETTER_AUTH_SECRET` | Yes | Secret for signing sessions and tokens. Generate with `bunx auth@latest secret` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID ([console](https://console.cloud.google.com/apis/credentials)) |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

Google sign-in is optional – email OTP and passkeys work without it. Set both variables or neither; supplying one is a configuration error rather than a silent half-enabled provider.

See [Authentication](/auth/) for provider setup details.

### AI

| Variable | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | No | [OpenAI](https://platform.openai.com/) API key (AI SDK) – AI features are unavailable without it |

### Email

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | [Resend](https://resend.com) API key for sending emails |
| `RESEND_EMAIL_FROM` | Yes | Sender address (e.g., `noreply@example.com`) |

### Billing (Optional)

Stripe billing is optional – with none of these set the app works normally, the subscription query reports `enabled: false`, and Stripe mutation endpoints return 404. Setting only some of the first four throws when authentication initializes, naming what is missing; `STRIPE_PRO_ANNUAL_PRICE_ID` is independently optional.

| Variable | Required | Description |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | No | Stripe API secret key |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook signing secret |
| `STRIPE_STARTER_PRICE_ID` | No | Stripe Price ID for the Starter plan |
| `STRIPE_PRO_PRICE_ID` | No | Stripe Price ID for the Pro plan (monthly) |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | No | Stripe Price ID for the Pro plan (annual) |

See [Billing](/billing/) for Stripe configuration.

### Cloudflare

| Variable                | Required    | Description                        |
| ----------------------- | ----------- | ---------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID` | Deploy only | Cloudflare account ID              |
| `CLOUDFLARE_API_TOKEN`  | Deploy only | API token for Wrangler deployments |
