# Procedures

tRPC procedures are the primary way the frontend communicates with the API. Each procedure is either a **query** (read data) or a **mutation** (write data), with optional input validation via Zod.

## Procedure Types

The project defines two base procedures in `apps/api/lib/trpc.ts`:

### `publicProcedure`

Accessible to all callers, including unauthenticated users. Context includes `db`, `env`, and `cache` but `session` and `user` may be `null`.

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

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      id: ctx.user.id, // ✓ guaranteed non-null
      email: ctx.user.email,
      name: ctx.user.name,
    };
  }),
});
```

## Router Files

Each domain gets its own router file in `apps/api/routers/`:

```
routers/
├── billing.ts         # billing.subscription
├── organization.ts    # organization.list, .create, .update, .delete, ...
└── user.ts            # user.me, .updateProfile, .list
```

Routers are merged into the root `appRouter` in `apps/api/lib/app.ts`:

```ts
const appRouter = router({
  billing: billingRouter,
  user: userRouter,
  organization: organizationRouter,
});
```

The client calls procedures using the namespace: `api.user.me`, `api.billing.subscription`, etc.

## Input Validation

Define inputs with Zod schemas. tRPC validates them automatically and returns structured errors on failure (see [Validation & Errors](./validation-errors)).

```ts
import { z } from "zod";

export const userRouter = router({
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).optional(),
        email: z.email({ error: "Invalid email address" }).optional(),
      }),
    )
    .mutation(({ input, ctx }) => {
      // `input` is fully typed: { name?: string; email?: string }
      return { id: ctx.user.id, ...input };
    }),
});
```

For queries with pagination:

```ts
list: protectedProcedure
  .input(
    z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().optional(),
    }),
  )
  .query(({ input }) => {
    // input.limit defaults to 10 if not provided
    return { users: [], nextCursor: null };
  }),
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
  user: userRouter,
  organization: organizationRouter,
  post: postRouter, // [!code ++]
});
```

**3. Call from the frontend** – the types propagate automatically:

```ts
const { data } = useSuspenseQuery(api.post.list.queryOptions({ limit: 10 }));
```

## Naming Conventions

- **Router files**: singular noun matching the domain (`user.ts`, `billing.ts`, `organization.ts`)
- **Router variables**: `{domain}Router` – `userRouter`, `billingRouter`
- **Procedure names**: verb or short phrase – `me`, `list`, `create`, `updateProfile`
- **Namespace key**: matches the domain – `user:`, `billing:`, `organization:`

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

<!-- See Testing docs for mock context patterns and more examples. -->
