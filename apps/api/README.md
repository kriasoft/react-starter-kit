# API Layer

You've reached the API layer, the backend core of the React Starter Kit. This is where we leverage tRPC for end-to-end type safety, connecting your React frontend to a high-performance tRPC API server. The architecture is designed for building robust, maintainable, and scalable APIs from day one.

## Architecture Overview

Our core stack includes [tRPC](https://trpc.io/) for end-to-end type safety, [Better Auth](https://www.better-auth.com/) for authentication, and [Drizzle ORM](https://orm.drizzle.team/) for database interactions. This API package is designed to be environment-agnostic, allowing for seamless deployment to various platforms such as Cloudflare Workers ([`/edge`](../edge)), Vercel Edge Functions, or Google Cloud Run.

### Why tRPC?

- **End-to-end type safety**: Your API contracts are enforced at compile time, not runtime surprises
- **No code generation**: Unlike GraphQL, there's no build step to mess up your CI/CD pipeline
- **Auto-completion everywhere**: Your IDE knows what methods exist before you do
- **Lightweight**: Ships almost no runtime code to your client bundle
- **Edge-ready**: Works perfectly with Cloudflare Workers and other edge runtimes

## Project Structure

```
api/
├── lib/                    # Core API infrastructure
│   ├── context.ts          # tRPC context setup (request, session, database)
│   ├── hono.ts             # Hono framework integration
│   ├── loaders.ts          # DataLoader utilities for efficient queries
│   └── trpc.ts             # tRPC router and procedure setup
├── routers/                # API route definitions
│   ├── app.ts              # Application-level routes
│   ├── user.ts             # User management endpoints
│   └── organization.ts     # Multi-tenant organization routes
├── router.ts               # Main router that combines all sub-routers
├── index.ts                # Package exports and type definitions
└── package.json            # Scripts and dependencies
```

## API Design Philosophy

### Authentication & Authorization

Our API uses a three-tier security model:

1. **Public procedures**: Anyone can call these (health checks, public data)
2. **Protected procedures**: Requires valid session (user profile, organization data)
3. **Role-based procedures**: Requires specific permissions (admin actions, billing)

### Context Architecture (`lib/context.ts`)

Every API call gets a rich context object containing:

```typescript
type TRPCContext = {
  req: Request; // Original HTTP request
  info: CreateHTTPContextOptions["info"]; // Request metadata
  db: ReturnType<typeof drizzle>; // Database connection
  session: Session | null; // User session (if authenticated)
  cache: Map<string | symbol, unknown>; // Request-scoped cache
  res?: Response; // Optional response object for Hono
  resHeaders?: Headers; // Optional headers for Hono
  env?: CloudflareEnv; // Environment variables for Cloudflare
};
```

### Data Loading Strategy (`lib/loaders.ts`)

We use [DataLoader](https://github.com/graphql/dataloader) to solve the N+1 query problem and provide intelligent caching:

- **Batch loading**: Multiple requests for the same resource type get batched
- **Request-scoped caching**: Prevents duplicate queries within a single request
- **Type-safe loaders**: Each loader is typed for specific database entities

## Router Architecture

### Main Router (`router.ts`)

The main router combines all feature-specific routers:

```typescript
export const mainRouter = router({
  app: appRouter, // Application metadata, health checks
  user: userRouter, // User profile management
  organization: organizationRouter, // Multi-tenant features
});
```

### Feature Routers (`routers/`)

Each domain gets its own router for better organization:

#### User Router (`routers/user.ts`)

- `me`: Get current user profile
- `updateProfile`: Update user information
- `list`: Paginated user listing (admin only)

#### Organization Router (`routers/organization.ts`)

- Multi-tenant SaaS features
- Member management
- Role-based access control
- Invitation system

#### App Router (`routers/app.ts`)

- Health checks and status endpoints
- Application metadata
- Public configuration data

## Development Workflow

### Local Development

```bash
# Build API types
bun --filter api build

# Run type checking
bun --filter api typecheck

# Run tests
bun --filter api test

# Watch mode for development
bun --filter api test --watch
```

### Adding New Endpoints

1. **Choose the right router**: Does it belong in `user.ts`, `organization.ts`, or needs a new router?

2. **Define your procedure**:

   ```typescript
   export const myRouter = router({
     myEndpoint: protectedProcedure
       .input(
         z.object({
           name: z.string().min(1),
           optional: z.number().optional(),
         }),
       )
       .mutation(async ({ input, ctx }) => {
         // Your business logic here
         return { success: true };
       }),
   });
   ```

3. **Add to main router** in `router.ts`:

   ```typescript
   export const mainRouter = router({
     // ... existing routers
     myFeature: myRouter,
   });
   ```

4. **Test your endpoint** with proper error handling and validation

### Input Validation with Zod

Every input should be validated using [Zod](https://zod.dev/):

```typescript
.input(z.object({
  email: z.string().email("Please provide a valid email"),
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
  age: z.number().int().min(0).max(120).optional(),
  preferences: z.object({
    theme: z.enum(["light", "dark"]),
    notifications: z.boolean(),
  }).optional(),
}))
```

### Error Handling

Use tRPC's built-in error system for consistent error responses:

```typescript
import { TRPCError } from "@trpc/server";

// In your procedure
if (!user) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "User not found",
    cause: originalError, // Optional: include original error
  });
}
```

Common error codes:

- `BAD_REQUEST`: Invalid input or malformed request
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource doesn't exist
- `INTERNAL_SERVER_ERROR`: Something went wrong on our end

## Authentication Integration

### Better Auth Setup

Our authentication system integrates seamlessly with tRPC through the context:

```typescript
// In a protected procedure
const { session } = ctx;
if (!session) {
  throw new TRPCError({ code: "UNAUTHORIZED" });
}

const userId = session.userId; // Type-safe user ID
```

### Session Management

Sessions are automatically validated and included in the context. The `protectedProcedure` base ensures only authenticated users can access protected endpoints.

## Performance Optimization

### DataLoader Usage

DataLoaders are pre-configured for common queries:

```typescript
// Efficient user loading with automatic batching
const user = await userById(ctx).load(userId);

// Multiple users loaded in a single query
const users = await userById(ctx).loadMany([id1, id2, id3]);
```

### Request-Scoped Caching

The context includes a cache Map for storing expensive computations:

```typescript
const cacheKey = `expensive-calculation-${input.id}`;
if (ctx.cache.has(cacheKey)) {
  return ctx.cache.get(cacheKey);
}

const result = await expensiveOperation(input);
ctx.cache.set(cacheKey, result);
return result;
```

## Deployment Architecture

### Cloudflare Workers Integration

The API is designed to run on Cloudflare Workers with zero configuration:

- **Edge deployment**: API runs close to your users globally
- **Neon PostgreSQL database**: Integrated with our Drizzle ORM setup
- **Environment variables**: Managed through Cloudflare dashboard
- **Request context**: Includes Cloudflare-specific environment and bindings

### Type Exports

The API package exports all necessary types for frontend integration:

```typescript
// Frontend usage
import type { AppRouter } from "@repo/api";
import { createTRPCClient } from "@trpc/client";

const client = createTRPCClient<AppRouter>({
  // ... configuration
});

// Fully typed API calls
const user = await client.user.me.query();
const updated = await client.user.updateProfile.mutate({
  name: "New Name",
});
```

## Testing Strategy

### Unit Testing

Each router should have corresponding tests:

```typescript
// tests/user.test.ts
import { describe, it, expect } from "vitest";
import { createMockContext } from "./helpers";
import { userRouter } from "../routers/user";

describe("userRouter", () => {
  it("should return current user profile", async () => {
    const ctx = createMockContext({ userId: "123" });
    const caller = userRouter.createCaller(ctx);

    const result = await caller.me();
    expect(result.id).toBe("123");
  });
});
```

### Integration Testing

Test the complete request flow including authentication and database operations.

## Troubleshooting

### Type Errors

If you're getting type errors after adding new endpoints:

1. **Rebuild the API package**: `bun --filter api build`
2. **Check your imports**: Make sure you're importing from the right path
3. **Verify exports**: New routers must be exported from `router.ts`

### Runtime Errors

Common issues and solutions:

- **"Context not found"**: Make sure your middleware is properly configured
- **"Procedure not found"**: Check that your router is added to the main router
- **Database connection errors**: Verify your Neon database is set up and accessible

### Performance Issues

- **Slow queries**: Check if you're using DataLoaders properly
- **Memory leaks**: Ensure you're not storing large objects in the request cache
- **High latency**: Consider adding more aggressive caching strategies

## Best Practices

### Security

1. **Always validate inputs** with Zod schemas
2. **Use protected procedures** for authenticated endpoints
3. **Implement proper authorization** checks in your business logic
4. **Sanitize database inputs** to prevent injection attacks
5. **Never expose sensitive data** in API responses

### Performance

1. **Use DataLoaders** for database queries
2. **Implement request-scoped caching** for expensive operations
3. **Paginate large datasets** with cursor-based pagination
4. **Optimize database queries** with proper indexes

### Maintainability

1. **Keep routers focused** on single domains
2. **Extract common logic** into reusable functions
3. **Write comprehensive tests** for business logic
4. **Document complex procedures** with JSDoc comments
5. **Use meaningful error messages** that help debugging

## Package Exports

Thanks to our package.json exports, you can import API components cleanly:

```typescript
// Import the main router and types
import { appRouter, type AppRouter } from "@repo/api";

// Import specific utilities
import { type TRPCContext } from "@repo/api";

// Import Hono integration
import { createHonoHandler } from "@repo/api/hono";
```

## Advanced Usage

### Custom Middleware

Create reusable middleware for common patterns:

```typescript
const auditMiddleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now();
  const result = await next();

  // Log API usage for analytics
  console.log(`${ctx.req.method} ${ctx.req.url} - ${Date.now() - start}ms`);

  return result;
});

export const auditedProcedure = publicProcedure.use(auditMiddleware);
```

### Subscription Support

While primarily designed for HTTP, tRPC supports subscriptions through WebSockets for real-time features.

## Migration Guide

When updating from older API patterns:

1. **REST to tRPC**: Convert REST endpoints to tRPC procedures
2. **GraphQL to tRPC**: Map GraphQL resolvers to tRPC procedures
3. **Custom auth to Better Auth**: Update authentication middleware

## Contributing

When adding new API features:

1. **Follow the existing patterns** for consistency
2. **Add proper input validation** with Zod
3. **Include comprehensive tests**
4. **Update type exports** if needed
5. **Document breaking changes**
6. **Consider backwards compatibility**

Remember: A well-designed API is like a good joke  if you have to explain it, it's probably not that good. But unlike jokes, APIs should be thoroughly documented <�

## Resources

- [tRPC Documentation](https://trpc.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Zod Documentation](https://zod.dev/)
- [DataLoader Documentation](https://github.com/graphql/dataloader)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

---

> _An API without types is like a contract written in disappearing ink 📝✨ — it looks good until you try to use it in production._  
> — 🧙‍♂️ Ancient TypeScript Proverb
