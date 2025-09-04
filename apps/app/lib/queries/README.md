# TanStack Queries

This folder contains TanStack Query implementations for managing server state and data fetching in the application.

## Overview

TanStack Query provides powerful asynchronous state management for TypeScript/JavaScript applications. All query definitions in this folder follow a consistent pattern that enables:

- **Automatic caching** - Data is cached and reused across components
- **Background refetching** - Stale data is automatically refreshed
- **Request deduplication** - Multiple components requesting the same data result in a single network request
- **Optimistic updates** - UI updates immediately while mutations are in-flight
- **Smart refetching** - Automatic refetch on window focus, network reconnect, and at configurable intervals

## File Structure

Each query module typically exports:

1. **Query Keys** - Unique identifiers for cache entries
2. **Query Options** - Factory functions returning query configurations
3. **Custom Hooks** - React hooks for consuming queries
4. **Utility Functions** - Helpers for prefetching, invalidation, and manual updates

## Pattern Example

```typescript
// user.ts - Example query module structure

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";

// 1. Define query keys with consistent naming
export const userQueryKey = ["users", "detail"] as const;
export const usersListQueryKey = ["users", "list"] as const;

// 2. Create query options factory functions
export function userQueryOptions(userId: string) {
  return queryOptions({
    queryKey: [...userQueryKey, userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");
      return response.json();
    },
    staleTime: 5 * 60_000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60_000, // Keep in cache for 10 minutes
  });
}

// 3. Export convenient hooks
export function useUser(userId: string) {
  return useQuery(userQueryOptions(userId));
}

export function useSuspenseUser(userId: string) {
  return useSuspenseQuery(userQueryOptions(userId));
}

// 4. Provide utility functions
export async function prefetchUser(queryClient: QueryClient, userId: string) {
  return queryClient.prefetchQuery(userQueryOptions(userId));
}

export function invalidateUser(queryClient: QueryClient, userId: string) {
  return queryClient.invalidateQueries({
    queryKey: [...userQueryKey, userId],
  });
}
```

## Query Key Conventions

Query keys should follow a hierarchical structure:

```typescript
["resource"][("resource", "list")][("resource", "list", { filters })][ // All queries for a resource // List queries // List with filters
  ("resource", "detail", id)
][("resource", "detail", id, "related")]; // Single item queries // Nested resources
```

## Configuration Guidelines

### staleTime

- How long data is considered fresh
- During this time, no background refetches occur
- Set based on data volatility (user sessions: 30s, static content: hours)

### gcTime (garbage collection time)

- How long to keep unused data in cache
- Should be >= staleTime
- Prevents refetching when navigating back quickly

### refetchOnWindowFocus

- Ensures data is fresh when users return
- Disable for rarely-changing data
- Critical for authentication state

### retry

- Number of retry attempts for failed queries
- Use exponential backoff with retryDelay
- Consider disabling for 4xx errors

## Current Implementations

### `session.ts`

Manages authentication session state with Better Auth integration:

- Automatic session refresh before expiry
- Optimistic updates during auth state changes
- Cache invalidation on login/logout
- Prefetching for protected routes

## Best Practices

1. **Colocate queries with their domain** - Keep related queries in the same file
2. **Export query options** - Allows usage in loaders and prefetching
3. **Use TypeScript** - Define return types for better type safety
4. **Handle errors gracefully** - Queries should throw meaningful errors
5. **Optimize cache times** - Balance freshness with performance
6. **Leverage suspense** - Use `useSuspenseQuery` with error boundaries
7. **Prefetch critical data** - Load data before users need it

## Testing

When testing components that use queries:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
    mutations: { retry: false },
  },
});

// In your test
const queryClient = createTestQueryClient();
render(
  <QueryClientProvider client={queryClient}>
    <YourComponent />
  </QueryClientProvider>
);
```

## Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Query Functions](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
- [Suspense](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
