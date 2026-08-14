# Procedures

tRPC procedures expose application-owned operations to the frontend. Each procedure is either a **query** (read data) or a **mutation** (write data), with optional input validation via Zod. Better Auth operations use its client instead, as described in [API Overview](./index.md).

## Procedure Types

The project defines two base procedures in `apps/api/lib/trpc.ts`:

### `publicProcedure`

Accessible to all callers, including unauthenticated users. Context carries the database clients and `env`; `session` and `user` may be `null`.

```ts
import { publicProcedure } from "../lib/trpc.js";

export const healthRouter = router({
  ping: publicProcedure.query(() => {
    return { status: "ok" };
  }),
});
```

### `protectedProcedure`

Requires an authenticated session. Throws `UNAUTHORIZED` if the user is not logged in. Context narrows `session` and `user` to non-null types – no runtime null checks needed.

```ts
import { protectedProcedure } from "../lib/trpc.js";

export const apiKeyRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.apiKey.findMany({
      where: (k, { eq }) => eq(k.userId, ctx.user.id), // ✓ guaranteed non-null
    });
  }),
});
```

An authenticated user is not an authorized tenant. Anything scoped to an organization must also verify membership – see [Query Patterns > Multi-tenant Queries](/database/queries#multi-tenant-queries). `billing.subscription` is the shipped example.

## Router Files

Each domain gets its own router file in `apps/api/routers/`:

```
routers/
├── billing.ts         # billing.subscription
└── config.ts          # config.socialProviders
```

The router set is deliberately small. Mutations that Better Auth already owns – profile updates, organization membership, Stripe checkout – are called through its client rather than wrapped in a procedure, because a wrapper would only re-implement authorization the plugin already enforces.

`billing.subscription` is the exception that shows where the line falls: reading subscription state joins the local `subscription` table with this deployment's plan limits, which is application data Better Auth knows nothing about. Add a router when you own the data.

Routers are merged into the root `appRouter` in `apps/api/lib/app.ts`:

```ts
const appRouter = router({
  billing: billingRouter,
  config: configRouter,
});
```

The client calls procedures using the namespace: `trpcClient.billing.subscription`, `trpcClient.config.socialProviders`, etc.

## Input Validation

Define inputs with Zod schemas. tRPC validates them automatically and returns structured errors on failure (see [Validation & Errors](./validation-errors)).

```ts
import { z } from "zod";

export const postRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        body: z.string().max(10_000),
      }),
    )
    .mutation(({ input }) => {
      // `input` is fully typed from the schema.
    }),
});
```

## Adding a New Procedure

**1. Create the router file** (or add to an existing one):

```ts
// apps/api/routers/post.ts
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

export const postRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.post.findMany({ limit: input.limit });
    }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Insert into database
    }),
});
```

**2. Register the router** in `apps/api/lib/app.ts`:

```ts
import { postRouter } from "../routers/post.js";

const appRouter = router({
  billing: billingRouter,
  config: configRouter,
  post: postRouter, // [!code ++]
});
```

**3. Call from the frontend** – the types propagate automatically:

```ts
// apps/app/lib/queries/post.ts
export function postsQueryOptions(limit: number) {
  return queryOptions({
    queryKey: ["post", "list", limit] as const,
    queryFn: () => trpcClient.post.list.query({ limit }),
  });
}
```

See [State & Data Fetching](/frontend/state) for why the query module owns the cache key.

## Naming Conventions

- **Router files**: singular noun matching the domain (`billing.ts`, `post.ts`, `project.ts`)
- **Router variables**: `{domain}Router` – `billingRouter`, `projectRouter`
- **Procedure names**: verb or short phrase – `me`, `list`, `create`, `update`
- **Namespace key**: matches the domain – `billing:`, `config:`, `post:`

## Testing Procedures

Use `createCallerFactory` to test procedures without HTTP:

```ts
import { createCallerFactory } from "../lib/trpc";
import { billingRouter } from "./billing";

const createCaller = createCallerFactory(billingRouter);

it("returns free plan defaults", async () => {
  const caller = createCaller(mockContext());
  const result = await caller.subscription();
  expect(result.plan).toBe("free");
});
```

See [Testing](/testing) for the test boundary and commands.
