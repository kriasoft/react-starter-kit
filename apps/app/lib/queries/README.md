# TanStack Queries

This directory owns reusable server-state queries. Components and route loaders share the same `queryOptions()` factories so cache keys, fetch functions, and freshness rules cannot diverge.

## Modules

| Module | Cache key | Purpose |
| --- | --- | --- |
| `session.ts` | `['auth', 'session']` | Better Auth session and auth-state helpers |
| `billing.ts` | `['billing', 'subscription', activeOrgId]` | Subscription state scoped to the active organization |
| `config.ts` | `['config', 'socialProviders']` | Server-derived deployment capabilities |

Tests live beside the query modules.

## Module Shape

A query module normally exports a stable key, an options factory, and only the hooks or cache helpers its callers use:

```ts
export const widgetQueryKey = ["widget", "detail"] as const;

export function widgetQueryOptions(id: string) {
  return queryOptions({
    queryKey: [...widgetQueryKey, id] as const,
    queryFn: () => trpcClient.widget.byId.query({ id }),
  });
}

export function useWidget(id: string) {
  return useQuery(widgetQueryOptions(id));
}
```

Use the same options factory in route `beforeLoad`, component hooks, prefetches, and tests. Do not repeat an equivalent key or fetch function at each call site.

## Current Decisions

- Session data is fresh for 30 seconds. It does not retry authorization errors, and it inherits focus/reconnect behavior from the root `QueryClient`.
- Sign-out writes `null` directly instead of invalidating a session known to be gone, then performs a hard redirect to clear all in-memory application state.
- After sign-in, `revalidateSession()` removes the cached value and invalidates the router so auth guards fetch a new session.
- Billing includes `activeOrgId` in its key even though the server derives the active organization from the session. Changing organizations must select a different cache entry.
- Social-provider configuration is fixed for a deployment, so it uses infinite `staleTime`. The auth pages prefetch it before rendering method buttons.

## Key Rules

- Include every value that changes the result in the query key.
- Use a stable prefix for intentional bulk invalidation.
- Normalize optional key parts when `undefined` and `null` mean the same thing.
- Let query functions throw meaningful errors; components and route boundaries decide how to present them.
- Override global freshness, retry, or refetch behavior only when the domain has a concrete reason.
- Do not put sessions or other server state in local storage.

## Testing

Tests that inspect cache behavior should create an isolated client with retries disabled:

```ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
```

Test key composition and cache helpers directly. Procedure response mapping belongs in API router tests; TanStack Query itself does not need to be retested.

See [Frontend State and Data Fetching](/frontend/state) and [Testing](/testing) for application-level patterns.
