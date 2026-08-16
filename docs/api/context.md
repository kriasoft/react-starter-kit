# Context & Middleware

Every tRPC procedure receives a context object (`ctx`) with request-scoped resources. The middleware chain builds this context before any procedure runs.

## TRPCContext

Defined in `apps/api/lib/context.ts`, the context provides:

| Field | Type | Description |
| --- | --- | --- |
| `req` | `Request` | The incoming HTTP request |
| `info` | `CreateHTTPContextOptions["info"]` | tRPC request metadata (headers, connection info) |
| `db` | [`Database`](/database/#importing-schemas) | Drizzle client via uncached Hyperdrive |
| `dbCached` | [`Database`](/database/#importing-schemas) | Drizzle client via cached Hyperdrive |
| `session` | `AuthSession \| null` | Authenticated session from Better Auth |
| `user` | `AuthUser \| null` | Authenticated user data |
| `res?` | `Response` | Optional HTTP response from Hono context |
| `resHeaders?` | `Headers` | Response headers (for setting cookies, etc.) |
| `env` | `Env` | Environment variables and secrets |

### Two Database Connections

The context provides two database connections with different caching behaviors:

- **`ctx.db`** – the default, uncached connection. Use for writes, transactions, auth, permissions, billing, and reads that must see the latest data.
- **`ctx.dbCached`** – opts into Hyperdrive's query cache. The staleness window is Terraform-owned; see [Production Database](/deployment/production-database).

```ts
// Read with caching when staleness is acceptable
const users = await ctx.dbCached.select().from(user);

// Writes and fresh reads use the default connection
await ctx.db.insert(post).values({ title: "Hello" });
```

## How Context is Constructed

Context is created per-request in the tRPC fetch adapter (`apps/api/lib/app.ts`):

```ts
app.use("/api/trpc/*", (c) => {
  return fetchRequestHandler({
    req: c.req.raw,
    router: appRouter,
    endpoint: "/api/trpc",
    async createContext({ req, resHeaders, info }) {
      const db = c.get("db");
      const dbCached = c.get("dbCached");
      const auth = c.get("auth");

      if (!db) throw new Error("Database not available in context");
      if (!dbCached)
        throw new Error("Cached database not available in context");
      if (!auth)
        throw new Error("Authentication service not available in context");

      const sessionData = await auth.api.getSession({
        headers: req.headers,
      });

      return {
        req,
        res: c.res,
        resHeaders,
        info,
        env: c.env,
        db,
        dbCached,
        session: sessionData?.session ?? null,
        user: sessionData?.user ?? null,
      };
    },
    batching: { enabled: true },
  });
});
```

The `db`, `dbCached`, and `auth` values come from the Hono middleware layer (set in `worker.ts`). The tRPC context adds session resolution on top.

## Middleware Chain

The Worker entrypoint (`worker.ts`) applies middleware in order:

```txt
Request
  │
  ├── errorHandler          ← catches all unhandled errors
  ├── notFoundHandler       ← returns 404 JSON for unmatched routes
  │
  ├── secureHeaders()       ← standard API security headers (no CSP by default)
  ├── requestId()           ← generates X-Request-Id (uses CF-Ray if available)
  ├── logger()              ← logs request method, path, status, duration
  │
  ├── context init          ← creates db, dbCached, auth; sets on Hono context
  │
  └── app.ts routes
        ├── /api/auth/*     ← Better Auth (session resolved internally)
        └── /api/trpc/*     ← tRPC (session resolved in createContext)
```

::: info

The `protectedProcedure` middleware (defined in `lib/trpc.ts`) adds another layer within tRPC. It checks that `session` and `user` are non-null and narrows their types – procedures using `protectedProcedure` never need null checks. See [Procedures](./procedures#protectedprocedure).

:::

::: tip

In production (`worker.ts`), the request ID generator uses the Cloudflare Ray ID when available. In local development (`dev.ts`), it falls back to the default UUID generator since `cf-ray` headers aren't present.

:::

## Request ID

The request ID middleware uses the Cloudflare Ray ID when available, falling back to `crypto.randomUUID()` in local development:

```ts
export function requestIdGenerator(c: Context): string {
  return c.req.header("cf-ray") ?? crypto.randomUUID();
}
```

The ID is available via the `X-Request-Id` response header for tracing requests across logs.
