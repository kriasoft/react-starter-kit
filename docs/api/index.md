---
outline: [2, 3]
---

# API Overview

The API server (`apps/api/`) runs as a Cloudflare Worker and handles all backend logic: authentication, data access, and billing webhooks. It combines two frameworks:

- **[Hono](https://hono.dev/)** – lightweight HTTP router for auth endpoints, webhooks, and health checks
- **[tRPC](https://trpc.io/)** – typed procedures for application-owned operations

Hono composes the HTTP routes and middleware. tRPC provides the typed contract for application-owned procedures. They share the same Worker and middleware stack.

Better Auth owns its own endpoints under `/api/auth/*` – sessions, organizations and the Stripe plugin. Those are called through its client, not wrapped in procedures, so tRPC covers what this application owns rather than everything the browser calls.

## How the Worker is Wired

The API has two entrypoints – one for production (Cloudflare Workers) and one for local development (Bun):

| File | Runtime | Description |
| --- | --- | --- |
| `worker.ts` | Cloudflare Workers | Production entrypoint |
| `dev.ts` | Bun | Local dev server via `wrangler` platform proxy |

Both follow the same structure:

```
worker.ts / dev.ts
  ├── errorHandler, notFoundHandler
  ├── secureHeaders()
  ├── requestId()
  ├── logger()
  ├── context init (db, dbCached, auth)
  └── mount app.ts
        ├── GET  /api          → API info (JSON)
        ├── GET  /health       → health check
        ├── *    /api/auth/*   → Better Auth handler
        └── *    /api/trpc/*   → tRPC fetch adapter
```

The top-level worker (`worker.ts`) sets up global middleware and initializes shared resources, then mounts the core Hono app (`lib/app.ts`) which defines the actual routes.

```ts
// apps/api/worker.ts (simplified)
const worker = new Hono();

worker.onError(errorHandler);
worker.notFound(notFoundHandler);
worker.use(secureHeaders());
worker.use(requestId({ generator: requestIdGenerator }));
worker.use(logger());

// Initialize shared context
worker.use(async (c, next) => {
  const db = createDb(c.env.HYPERDRIVE_UNCACHED);
  const dbCached = createDb(c.env.HYPERDRIVE_CACHED);

  c.set("db", db);
  c.set("dbCached", dbCached);
  c.set("auth", createAuth(db, c.env)); // Sessions must not be stale
  await next();
});

// Mount the core app
worker.route("/", app);
```

## Endpoints

| Path | Method | Handler | Description |
| --- | --- | --- | --- |
| `/` | GET | Hono | Redirects to `/api` |
| `/api` | GET | Hono | API metadata (name, version, endpoints) |
| `/health` | GET | Hono | Health check – returns `{ status, timestamp }` |
| `/api/auth/*` | GET, POST | Better Auth | Authentication routes ([docs](https://www.better-auth.com/docs/api-reference)) |
| `/api/trpc/*` | \* | tRPC | Type-safe RPC – application-owned queries and mutations |

## tRPC Router

The root router merges domain-specific sub-routers:

```ts
// apps/api/lib/app.ts
const appRouter = router({
  billing: billingRouter,
  config: configRouter,
});
```

Each sub-router lives in `routers/` and exports a single router instance. See [Procedures](./procedures) for details on adding your own.

## Project Structure

```bash
apps/api/
├── worker.ts              # Cloudflare Workers entrypoint
├── dev.ts                 # Local dev server (Bun)
├── index.ts               # Public package exports
├── lib/
│   ├── app.ts             # Hono app + tRPC router composition
│   ├── auth.ts            # Better Auth configuration
│   ├── context.ts         # TRPCContext and AppContext types
│   ├── db.ts              # Drizzle ORM database factory
│   ├── email.ts           # Resend email utilities
│   ├── env.ts             # Environment contract and inferred type
│   ├── middleware.ts       # Error handler, 404 handler, request ID
│   ├── plans.ts           # Subscription plan limits
│   └── trpc.ts            # tRPC init, procedures, error formatter
├── routers/
│   ├── billing.ts         # Subscription queries
│   ├── billing.test.ts    # Billing router tests
│   └── config.ts          # Public deployment capabilities
└── wrangler.jsonc         # Cloudflare Workers config
```

## Calling the API from the Frontend

The frontend app (`apps/app/`) calls `@trpc/client` from TanStack Query options. The tRPC client is configured in `apps/app/lib/trpc.ts`:

```ts
export const trpcClient = createTRPCClient<AppRouter>({ links });
```

Components never call `trpcClient` directly. Each concern gets a module in `apps/app/lib/queries/` that owns its cache key and freshness rules, so a key cannot be spelled two different ways in two components:

```ts
// apps/app/lib/queries/billing.ts
export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: ["billing", "subscription", activeOrgId ?? null] as const,
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}
```

See [State & Data Fetching](/frontend/state) for the component side.
