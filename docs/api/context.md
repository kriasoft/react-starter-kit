# Context & Middleware

Every tRPC procedure receives a context object (`ctx`) with request-scoped resources. The middleware chain builds this context before any procedure runs.

## TRPCContext

Defined in `apps/api/lib/context.ts`, the context provides:

| Field        | Type                             | Description                                              |
| ------------ | -------------------------------- | -------------------------------------------------------- |
| `db`         | `PostgresJsDatabase`             | Drizzle ORM instance via Hyperdrive (cached connections) |
| `dbDirect`   | `PostgresJsDatabase`             | Drizzle ORM instance via Hyperdrive (direct, no cache)   |
| `session`    | `AuthSession \| null`            | Authenticated session from Better Auth                   |
| `user`       | `AuthUser \| null`               | Authenticated user data                                  |
| `cache`      | `Map<string \| symbol, unknown>` | Request-scoped cache (for DataLoaders, computed values)  |
| `env`        | `Env`                            | Environment variables and secrets                        |
| `req`        | `Request`                        | The incoming HTTP request                                |
| `resHeaders` | `Headers`                        | Response headers (for setting cookies, etc.)             |

### Two Database Connections

The context provides two database connections with different caching behaviors:

- **`ctx.db`** – routed through Cloudflare Hyperdrive's connection pool with query caching. Use for read-heavy queries.
- **`ctx.dbDirect`** – bypasses the cache. Use for writes, transactions, and reads that must see the latest data.

```ts
// Read with caching
const users = await ctx.db.select().from(user);

// Write via direct connection
await ctx.dbDirect.insert(post).values({ title: "Hello" });
```

## How Context is Constructed

Context is created per-request in the tRPC fetch adapter (`apps/api/lib/app.ts`):

```ts
app.use("/api/trpc/*", (c) => {
  return fetchRequestHandler({
    router: appRouter,
    endpoint: "/api/trpc",
    async createContext({ req, resHeaders, info }) {
      const db = c.get("db");
      const dbDirect = c.get("dbDirect");
      const auth = c.get("auth");

      // Resolve session from request headers (cookies)
      const sessionData = await auth.api.getSession({
        headers: req.headers,
      });

      return {
        req,
        resHeaders,
        info,
        env: c.env,
        db,
        dbDirect,
        session: sessionData?.session ?? null,
        user: sessionData?.user ?? null,
        cache: new Map(),
      };
    },
  });
});
```

The `db`, `dbDirect`, and `auth` values come from the Hono middleware layer (set in `worker.ts`). The tRPC context adds session resolution and a fresh `cache` Map.

## Middleware Chain

The Worker entrypoint (`worker.ts`) applies middleware in order:

```
Request
  │
  ├── errorHandler          ← catches all unhandled errors
  ├── notFoundHandler       ← returns 404 JSON for unmatched routes
  │
  ├── secureHeaders()       ← security headers (CSP, X-Frame-Options, etc.)
  ├── requestId()           ← generates X-Request-Id (uses CF-Ray if available)
  ├── logger()              ← logs request method, path, status, duration
  │
  ├── context init          ← creates db, dbDirect, auth; sets on Hono context
  │
  └── app.ts routes
        ├── /api/auth/*     ← Better Auth (session resolved internally)
        └── /api/trpc/*     ← tRPC (session resolved in createContext)
```

::: info
The `protectedProcedure` middleware (defined in `lib/trpc.ts`) adds another layer within tRPC. It checks that `session` and `user` are non-null and narrows their types – procedures using `protectedProcedure` never need null checks. See [Procedures](./procedures#protectedprocedure).
:::

## Request ID

The request ID middleware uses the Cloudflare Ray ID when available, falling back to `crypto.randomUUID()` in local development:

```ts
export function requestIdGenerator(c: Context): string {
  return c.req.header("cf-ray") ?? crypto.randomUUID();
}
```

The ID is available via the `X-Request-Id` response header for tracing requests across logs.

## DataLoaders

DataLoaders prevent N+1 queries by batching multiple `.load(id)` calls into a single SQL `WHERE IN (...)` query. They're defined in `apps/api/lib/loaders.ts` and cached per-request via `ctx.cache`.

```ts
import { userById } from "../lib/loaders.js";

members: protectedProcedure
  .input(z.object({ organizationId: z.string() }))
  .query(async ({ ctx, input }) => {
    const members = await ctx.db.query.member.findMany({
      where: (m, { eq }) => eq(m.organizationId, input.organizationId),
    });

    // Batches all user lookups into one query
    const users = await Promise.all(
      members.map((m) => userById(ctx).load(m.userId)),
    );

    return members.map((m, i) => ({ ...m, user: users[i] }));
  }),
```

Loaders are created with a `defineLoader` helper that handles per-request caching via `ctx.cache`:

```ts
function defineLoader<K, V>(
  key: symbol,
  batchFn: (ctx: TRPCContext, keys: readonly K[]) => Promise<(V | null)[]>,
): (ctx: TRPCContext) => DataLoader<K, V | null>;
```

Each call returns a factory `(ctx) => DataLoader`. The first invocation per request creates the instance; subsequent calls return the cached one. Because `ctx.cache` is a `Map` created per-request, loaders are automatically scoped to the request lifecycle – no stale data across requests.

### Adding a DataLoader

Add a `defineLoader` call in `apps/api/lib/loaders.ts`:

```ts
export const postById = defineLoader(
  Symbol("postById"),
  async (ctx, ids: readonly string[]) => {
    const posts = await ctx.db
      .select()
      .from(post)
      .where(inArray(post.id, [...ids]));
    return mapByKey(posts, "id", ids);
  },
);
```

Then call `.load(key)` or `.loadMany(keys)` in your procedures.
