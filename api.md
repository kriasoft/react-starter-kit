---
url: /api.md
---

# API Overview

The API server (`apps/api/`) runs as a Cloudflare Worker and handles all backend logic: authentication, data access, and billing webhooks. It combines two frameworks:

* **[Hono](https://hono.dev/)** – lightweight HTTP router for auth endpoints, webhooks, and health checks
* **[tRPC](https://trpc.io/)** – type-safe RPC layer for all client-facing queries and mutations

Hono handles the HTTP surface. tRPC handles the typed contract between frontend and backend. They share the same Worker and middleware stack.

## How the Worker is Wired

The API has two entrypoints – one for production (Cloudflare Workers) and one for local development (Bun):

| File        | Runtime            | Description                                    |
| ----------- | ------------------ | ---------------------------------------------- |
| `worker.ts` | Cloudflare Workers | Production entrypoint                          |
| `dev.ts`    | Bun                | Local dev server via `wrangler` platform proxy |

Both follow the same structure:

```
worker.ts / dev.ts
  ├── errorHandler, notFoundHandler
  ├── secureHeaders()
  ├── requestId()
  ├── logger()
  ├── context init (db, dbDirect, auth)
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
  const db = createDb(c.env.HYPERDRIVE_CACHED);
  const dbDirect = createDb(c.env.HYPERDRIVE_DIRECT);

  c.set("db", db);
  c.set("dbDirect", dbDirect);
  c.set("auth", createAuth(db, c.env));
  await next();
});

// Mount the core app
worker.route("/", app);
```

## Endpoints

| Path          | Method    | Handler     | Description                                                                    |
| ------------- | --------- | ----------- | ------------------------------------------------------------------------------ |
| `/`           | GET       | Hono        | Redirects to `/api`                                                            |
| `/api`        | GET       | Hono        | API metadata (name, version, endpoints)                                        |
| `/health`     | GET       | Hono        | Health check – returns `{ status, timestamp }`                                 |
| `/api/auth/*` | GET, POST | Better Auth | Authentication routes ([docs](https://www.better-auth.com/docs/api-reference)) |
| `/api/trpc/*` | \*        | tRPC        | Type-safe RPC – all queries and mutations                                      |

## tRPC Router

The root router merges domain-specific sub-routers:

```ts
// apps/api/lib/app.ts
const appRouter = router({
  billing: billingRouter,
  user: userRouter,
  organization: organizationRouter,
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
│   ├── ai.ts              # OpenAI provider factory
│   ├── app.ts             # Hono app + tRPC router composition
│   ├── auth.ts            # Better Auth configuration
│   ├── context.ts         # TRPCContext and AppContext types
│   ├── db.ts              # Drizzle ORM database factory
│   ├── email.ts           # Resend email utilities
│   ├── env.ts             # Environment variable schema (Zod)
│   ├── loaders.ts         # DataLoader instances for N+1 prevention
│   ├── middleware.ts       # Error handler, 404 handler, request ID
│   ├── plans.ts           # Subscription plan limits
│   ├── stripe.ts          # Stripe client factory
│   └── trpc.ts            # tRPC init, procedures, error formatter
├── routers/
│   ├── billing.ts         # Subscription queries
│   ├── billing.test.ts    # Billing router tests
│   ├── organization.ts    # Organization CRUD
│   └── user.ts            # User profile queries
└── wrangler.jsonc         # Cloudflare Workers config
```

## Calling the API from the Frontend

The frontend app (`apps/app/`) uses `@trpc/client` with TanStack Query integration. The tRPC client is configured in `apps/app/lib/trpc.ts`:

```ts
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

export const api = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
```

Use `api` in components to call procedures with full type safety:

```ts
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "~/lib/trpc";

function Profile() {
  const { data } = useSuspenseQuery(api.user.me.queryOptions());
  return <p>{data.name}</p>;
}
```

See the [tRPC + TanStack Query docs](https://trpc.io/docs/client/react/tanstack-react-query) for the full client API.
