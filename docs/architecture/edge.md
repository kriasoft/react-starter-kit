# Edge

Implementation details for the Cloudflare Workers deployment. Read the [Architecture Overview](./) first for the mental model.

## Workers Configuration

Each worker has its own `wrangler.jsonc` in its workspace directory:

| Worker | Config | `nodejs_compat` | Static assets | Service bindings |
| --- | --- | :-: | :-: | :-: |
| web | `apps/web/wrangler.jsonc` | No | Marketing pages | APP_SERVICE, API_SERVICE |
| app | `apps/app/wrangler.jsonc` | No | SPA bundle | – |
| api | `apps/api/wrangler.jsonc` | Yes | – | – |

The API worker enables `nodejs_compat` for packages that depend on Node.js built-ins (e.g. `postgres`, `crypto`). The web and app workers don't need it – they only serve static assets and proxy requests.

## Service Bindings

Service bindings are **non-inheritable** in Wrangler – the top-level declaration only applies to production. Each environment must redeclare its bindings with the correct worker names.

```jsonc
// apps/web/wrangler.jsonc
{
  // Production (top-level)
  "services": [
    { "binding": "APP_SERVICE", "service": "example-app" },
    { "binding": "API_SERVICE", "service": "example-api" },
  ],

  "env": {
    "staging": {
      "services": [
        { "binding": "APP_SERVICE", "service": "example-app-staging" },
        { "binding": "API_SERVICE", "service": "example-api-staging" },
      ],
    },
  },
}
```

Worker naming convention: `<project>-<worker>-<env>`. Production omits the environment suffix.

| Environment | Web | App | API |
| --- | --- | --- | --- |
| Production | `example-web` | `example-app` | `example-api` |
| Staging | `example-web-staging` | `example-app-staging` | `example-api-staging` |

## Hyperdrive

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) provides connection pooling between Workers and Neon PostgreSQL. The API worker declares two bindings per environment:

| Binding               | Caching  | Purpose                                |
| --------------------- | -------- | -------------------------------------- |
| `HYPERDRIVE_CACHED`   | Enabled  | Read-heavy queries                     |
| `HYPERDRIVE_UNCACHED` | Disabled | Writes and consistency-sensitive reads |

```jsonc
// apps/api/wrangler.jsonc
"hyperdrive": [
  { "binding": "HYPERDRIVE_CACHED", "id": "your-hyperdrive-cached-id-here" },
  { "binding": "HYPERDRIVE_UNCACHED", "id": "your-hyperdrive-uncached-id-here" }
]
```

Each environment has its own Hyperdrive IDs pointing to the corresponding Neon database branch.

The connection code in `apps/api/lib/db.ts`:

```ts
import { schema } from "@repo/db";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createDb(db: Hyperdrive) {
  const client = postgres(db.connectionString, {
    max: 1, // Two clients per request share the connection budget
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    transform: { undefined: null },
    onnotice: () => {}, // Suppress PostgreSQL NOTICE messages
  });
  return drizzle(client, { schema, casing: "snake_case" });
}
```

Key settings: `max: 1` per client, because every request builds two of them and Workers caps concurrent external connections. Prepared statements are left enabled – [Hyperdrive only caches queries it sees prepared](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/), so turning them off would cost the cache and add a round-trip. That is also why the origin must be an unpooled host: a transaction-mode pooler in front of Postgres breaks prepared statements.

## Static Assets

### Web Worker

The web worker serves marketing pages from `apps/web/dist/`. The `run_worker_first` setting forces specific paths through the worker script before falling back to static assets:

```jsonc
// apps/web/wrangler.jsonc
"assets": {
  "directory": "./dist",
  "binding": "ASSETS",
  "run_worker_first": ["/"]
}
```

This is required for the `/` route where the worker checks the auth hint cookie to decide between the marketing page and the app dashboard. All other paths either match explicit worker routes (`/api/*`, `/login*`) or fall through to static assets.

### App Worker

The app worker is a pure static asset worker with SPA fallback – no custom worker script:

```jsonc
// apps/app/wrangler.jsonc
"assets": {
  "directory": "./dist",
  "not_found_handling": "single-page-application"
}
```

`not_found_handling: "single-page-application"` returns `index.html` for any path that doesn't match a static file, enabling TanStack Router's client-side routing.

## Auth Hint Cookie Routing

The web worker's `/` route uses the auth hint cookie to choose between two upstream workers:

```ts
// apps/web/worker.ts
app.on(["GET", "HEAD"], "/", async (c) => {
  const hasAuthHint =
    getCookie(c, "__Host-auth") === "1" || getCookie(c, "auth") === "1";

  const upstream = await (hasAuthHint ? c.env.APP_SERVICE : c.env.ASSETS).fetch(
    c.req.raw,
  );

  // Prevent caching – response varies by auth state
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("Vary", "Cookie");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
});
```

The `Cache-Control: private, no-store` and `Vary: Cookie` headers prevent CDN and browser caches from serving the wrong version (marketing page to a logged-in user or vice versa). See [ADR-001](/adr/001-auth-hint-cookie) for the full decision record.

## Infrastructure

Terraform provisions what the workers consume. Wrangler owns the workers themselves – names, code, routes, custom domains and bindings. Nothing is configured by both tools, so the two can never disagree. See [ADR-002](/adr/002-terraform-wrangler-boundary).

```
infra/
├── modules/
│   └── cloudflare/    # Hyperdrive pair, optional R2 bucket
└── envs/              # One root = one HCP Terraform workspace = one state
    ├── staging/
    └── production/
```

Each environment gets a cached and an uncached Hyperdrive configuration:

```hcl
module "edge" {
  source = "../../modules/cloudflare"

  account_id   = var.cloudflare_account_id
  project_slug = var.project_slug
  environment  = "staging"       # hard-coded: the directory already decided
  database_url = var.database_url
}
```

Applying it outputs the two IDs, which you paste into the matching environment block of `apps/api/wrangler.jsonc`. Worker names come from `wrangler.jsonc` alone: the top-level config deploys production, and `--env <name>` appends `-<name>`, which is what service bindings resolve against.

## Local Development

`bun dev` starts three local development servers:

| Service | Runtime | Port   | Notes                                      |
| ------- | ------- | ------ | ------------------------------------------ |
| app     | Vite    | `5173` | Main development entry point               |
| web     | Astro   | `4321` | Marketing site                             |
| api     | Bun     | `8787` | Hono server; the app proxies `/api/*` here |

The deployed service-binding topology is not reproduced locally. Vite proxies `/api/*` to the Bun server, while `apps/api/dev.ts` uses Wrangler's `getPlatformProxy()` only to emulate the two Hyperdrive bindings, which it resolves from the `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_*` variables – not from `DATABASE_URL`, which belongs to the Drizzle tooling in `db/`.

::: tip

Email templates must be built before starting the API dev server. The `bun dev` script handles this automatically by running `bun email:build` first.

:::
