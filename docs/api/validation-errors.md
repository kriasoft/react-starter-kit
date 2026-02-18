# Validation & Errors

Input validation and error handling follow one flow: Zod schemas validate procedure inputs, validation failures produce tRPC errors, and the error formatter attaches structured details for the client.

## Input Validation

Every tRPC procedure can define a Zod schema via `.input()`. tRPC runs validation automatically before the procedure body executes.

```ts
updateProfile: protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).optional(),
      email: z.email({ error: "Invalid email address" }).optional(),
    }),
  )
  .mutation(({ input }) => {
    // Only runs if input passes validation
  }),
```

When validation fails, tRPC returns a `BAD_REQUEST` error with the Zod error attached (see [Error Formatter](#error-formatter) below).

## Error Formatter

The tRPC initialization in `apps/api/lib/trpc.ts` includes a custom error formatter that attaches Zod validation details to the response:

```ts
const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? flattenError(error.cause) : null,
      },
    };
  },
});
```

This means every error response includes a `zodError` field – either a [flattened Zod error](https://zod.dev/api?id=flattenerror) object or `null`. Clients can use this for field-level error display.

Example error response for a failed validation:

```json
{
  "error": {
    "message": "...",
    "code": -32600,
    "data": {
      "code": "BAD_REQUEST",
      "zodError": {
        "formErrors": [],
        "fieldErrors": {
          "email": ["Invalid email address"]
        }
      }
    }
  }
}
```

## Throwing Errors in Procedures

For business logic errors, throw `TRPCError` with an appropriate code:

```ts
import { TRPCError } from "@trpc/server";

create: protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    const existing = await ctx.db.query.organization.findFirst({
      where: (o, { eq }) => eq(o.name, input.name),
    });

    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Organization name already taken",
      });
    }

    // ... create organization
  }),
```

Common tRPC error codes:

| Code                    | HTTP Status | When to Use                                             |
| ----------------------- | ----------- | ------------------------------------------------------- |
| `BAD_REQUEST`           | 400         | Invalid input (automatic from Zod)                      |
| `UNAUTHORIZED`          | 401         | Not authenticated (automatic from `protectedProcedure`) |
| `FORBIDDEN`             | 403         | Authenticated but lacking permission                    |
| `NOT_FOUND`             | 404         | Resource doesn't exist                                  |
| `CONFLICT`              | 409         | Duplicate or conflicting state                          |
| `INTERNAL_SERVER_ERROR` | 500         | Unexpected server error                                 |

See the full list in the [tRPC error codes reference](https://trpc.io/docs/server/error-handling#error-codes).

## HTTP Error Handling

Hono middleware in `apps/api/lib/middleware.ts` catches errors outside the tRPC layer:

```ts
export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(`[${c.req.method}] ${c.req.path}:`, err);
  return c.json({ error: "Internal Server Error" }, 500);
};
```

- **`HTTPException`** (from Hono) – returns the exception's response directly. Used by Better Auth and webhook handlers.
- **Unexpected errors** – logged and returned as a generic 500.

The tRPC adapter also logs errors independently:

```ts
onError({ error, path }) {
  console.error("tRPC error on path", path, ":", error);
},
```

## Client-Side Error Handling

The frontend app provides three utilities in `apps/app/lib/errors.ts` for working with errors from both tRPC and Better Auth:

### `getErrorStatus(error)`

Extracts the HTTP status code from various error shapes:

```ts
import { getErrorStatus } from "~/lib/errors";

try {
  await trpcClient.organization.create.mutate({ name: "" });
} catch (err) {
  const status = getErrorStatus(err); // 400
}
```

### `isUnauthenticatedError(error)`

Checks if the error indicates a 401 / `UNAUTHORIZED` state. Useful for triggering redirects to login:

```ts
import { isUnauthenticatedError } from "~/lib/errors";

if (isUnauthenticatedError(error)) {
  navigate({ to: "/login" });
}
```

::: tip
`isUnauthenticatedError` checks for HTTP 401 and tRPC `UNAUTHORIZED` code. It does **not** match 403 (Forbidden) – that means authenticated but lacking permission.
:::

### `getErrorMessage(error)`

Safely extracts a human-readable message from any thrown value:

```ts
import { getErrorMessage } from "~/lib/errors";

const message = getErrorMessage(error);
// "Organization name already taken" or "An unexpected error occurred"
```
