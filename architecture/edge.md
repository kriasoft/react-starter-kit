---
url: /architecture/edge.md
---
# Edge

Implementation details for the Cloudflare Workers deployment. Read the [Architecture Overview](./) first for the mental model.

## Workers Configuration

Each worker has its own `wrangler.jsonc` in its workspace directory:

| Worker | Config                    | `nodejs_compat` |  Static assets  |     Service bindings     |
| ------ | ------------------------- | :-------------: | :-------------: | :----------------------: |
| web    | `apps/web/wrangler.jsonc` |       No        | Marketing pages | APP\_SERVICE, API\_SERVICE |
| app    | `apps/app/wrangler.jsonc` |       No        |   SPA bundle    |            –             |
| api    | `apps/api/wrangler.jsonc` |       Yes       |        –        |            –             |

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
    "preview": {
      "services": [
        { "binding": "APP_SERVICE", "service": "example-app-preview" },
        { "binding": "API_SERVICE", "service": "example-api-preview" },
      ],
    },
  },
}
```

Worker naming convention: `<project>-<worker>-<env>`. Production omits the environment suffix.

| Environment | Web                   | App                   | API                   |
| ----------- | --------------------- | --------------------- | --------------------- |
| Production  | `example-web`         | `example-app`         | `example-api`         |
| Staging     | `example-web-staging` | `example-app-staging` | `example-api-staging` |
| Preview     | `example-web-preview` | `example-app-preview` | `example-api-preview` |

## Hyperdrive

[Cloudflare Hyperdrive](https://developers.cloudflare.com/hyperdrive/) provides connection pooling between Workers and Neon PostgreSQL. The API worker declares two bindings per environment:

| Binding             | Caching        | Purpose                                |
| ------------------- | -------------- | -------------------------------------- |
| `HYPERDRIVE_CACHED` | Default (60 s) | Read-heavy queries                     |
| `HYPERDRIVE_DIRECT` | Disabled       | Writes and consistency-sensitive reads |

```jsonc
// apps/api/wrangler.jsonc
"hyperdrive": [
  { "binding": "HYPERDRIVE_CACHED", "id": "your-hyperdrive-cached-id-here" },
  { "binding": "HYPERDRIVE_DIRECT", "id": "your-hyperdrive-direct-id-here" }
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
    max: 1, // Workers are single-request; one connection is enough
    prepare: false, // Avoids prepared statement caching issues in Workers
    connect_timeout: 10,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    transform: { undefined: null },
  });
  return drizzle(client, { schema, casing: "snake_case" });
}
```

Key settings: `max: 1` because each Worker invocation handles a single request. `prepare: false` prevents issues with Hyperdrive's connection reuse where prepared statements from a previous request may not exist on the pooled connection.

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

Worker metadata and Hyperdrive bindings are provisioned with Terraform. Wrangler handles code deployment and route configuration.

```
infra/
├── stacks/
│   ├── edge/          # Workers, Hyperdrive, DNS
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── hybrid/        # Database and other resources
├── modules/
│   ├── cloudflare/    # Worker, Hyperdrive, DNS modules
│   └── gcp/
├── envs/              # Per-environment variable files
└── templates/
```

The edge stack (`infra/stacks/edge/main.tf`) creates all three workers, a Hyperdrive binding pair, and DNS records:

```hcl
module "worker_api" {
  source = "../../modules/cloudflare/worker"
  name   = "${var.project_slug}-api${local.worker_suffix}"
  # ...
}

module "hyperdrive" {
  source       = "../../modules/cloudflare/hyperdrive"
  name         = "${var.project_slug}-${var.environment}"
  database_url = var.neon_database_url
}
```

The `worker_suffix` local resolves to `""` for production and `"-${var.environment}"` for other environments, matching the naming convention used in service bindings.

## Local Development

`bun dev` starts all three workers concurrently with Wrangler's dev mode:

| Worker | Port   | Notes                                   |
| ------ | ------ | --------------------------------------- |
| web    | `5173` | Entry point – open this in your browser |
| app    | `5174` | Accessed via service binding from web   |
| api    | `5175` | Accessed via service binding from web   |

In development, Wrangler simulates service bindings locally – requests between workers happen in-process rather than over the network. The `dev` environment in each `wrangler.jsonc` provides development-specific variables (`APP_ORIGIN: http://localhost:5173`, etc.).

::: tip
Email templates must be built before starting the API dev server. The `bun dev` script handles this automatically by running `bun email:build` first.
:::
