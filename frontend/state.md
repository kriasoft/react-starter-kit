---
url: /frontend/state.md
---
# State & Data Fetching

Server state is managed with [TanStack Query](https://tanstack.com/query/latest) through a tRPC integration. Client state uses [Jotai](https://jotai.org/) atoms when needed.

## tRPC Client

The tRPC client in `apps/app/lib/trpc.ts` provides two exports:

```tsx
import { trpcClient } from "@/lib/trpc"; // Raw tRPC client
import { api } from "@/lib/trpc"; // TanStack Query integration
```

* **`trpcClient`** – call procedures directly (useful in query functions, `beforeLoad`, and non-React code)
* **`api`** – creates `queryOptions` objects for use with TanStack Query hooks

The client sends requests to `/api/trpc` with batched HTTP transport and includes credentials for cookie-based auth. A logger link is added in development.

## TanStack Query Defaults

The `QueryClient` in `apps/app/lib/query.ts` is configured with sensible defaults:

| Option                 | Value      | Rationale                                            |
| ---------------------- | ---------- | ---------------------------------------------------- |
| `staleTime`            | 2 min      | Prevents redundant API calls during typical sessions |
| `gcTime`               | 5 min      | Balances memory with instant data on back-navigation |
| `retry`                | 3          | Exponential backoff: 1s, 2s, 4s (capped at 30s)      |
| `refetchOnWindowFocus` | `true`     | Keeps data current after tab switches                |
| `refetchOnReconnect`   | `"always"` | Overrides `staleTime` after connectivity loss        |

Mutations retry once with a 1s delay.

## Session Query

The session query (`apps/app/lib/queries/session.ts`) is the canonical example of a query module. It overrides global defaults where auth requires different behavior:

```tsx
export function sessionQueryOptions() {
  return queryOptions<SessionData | null>({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const response = await auth.getSession();
      if (response.error) throw response.error;
      return response.data;
    },
    // Auth state should stay fresher than general data
    staleTime: 30_000,
    // Don't retry 401/403 – retrying won't help
    retry(failureCount, error) {
      const status = getErrorStatus(error);
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
  });
}
```

Returns `null` when unauthenticated – not an error. The module also exports helpers for cache access:

| Export                                   | Purpose                                                     |
| ---------------------------------------- | ----------------------------------------------------------- |
| `useSessionQuery()`                      | Basic hook                                                  |
| `useSuspenseSessionQuery()`              | Suspense-enabled version                                    |
| `getCachedSession(queryClient)`          | Sync cache read (no network)                                |
| `isAuthenticated(queryClient)`           | Binary check – requires both `user` and `session`           |
| `signOut(queryClient)`                   | Clears server session, sets cache to `null`, hard redirects |
| `revalidateSession(queryClient, router)` | Removes cached query so `beforeLoad` fetches fresh          |

## Billing Query

The billing query demonstrates multi-tenant key design – including `activeOrgId` in the key causes automatic refetch when the user switches organizations:

```tsx
// apps/app/lib/queries/billing.ts
export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: ["billing", "subscription", activeOrgId ?? null],
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}
```

Usage in a component:

```tsx
function BillingCard() {
  const { data: session } = useSessionQuery();
  const activeOrgId = session?.session?.activeOrganizationId;
  const { data: billing, isLoading } = useBillingQuery(activeOrgId);
  // ...
}
```

## Calling Procedures from Components

Use the `api` proxy to create query options, then pass them to TanStack Query hooks:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "@/lib/trpc";

function UserList() {
  const { data: users } = useSuspenseQuery(api.user.list.queryOptions());

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

For mutations:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";

function CreateUserButton() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input: { name: string; email: string }) =>
      trpcClient.user.create.mutate(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <button
      onClick={() =>
        mutation.mutate({ name: "Alice", email: "alice@example.com" })
      }
    >
      Create User
    </button>
  );
}
```

## Cache Invalidation

Invalidate by query key prefix to refresh related data after mutations:

```tsx
// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: ["user"] });

// Invalidate all billing queries (any org)
queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
```

For session changes, use `removeQueries` instead of `invalidateQueries` – this forces `beforeLoad` guards to fetch fresh data rather than serving stale cache:

```tsx
queryClient.removeQueries({ queryKey: ["auth", "session"] });
await router.invalidate();
```

## Jotai Store

A global Jotai store is set up in `apps/app/lib/store.ts` for cross-component client state. It's wired into the app via `StoreProvider` but not heavily used – TanStack Query handles most state needs. Use Jotai for UI state that doesn't belong in server cache (theme preference, sidebar open/closed, local filters).

```tsx
import { atom, useAtom } from "jotai";

const sidebarOpenAtom = atom(true);

function Sidebar() {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  // ...
}
```

See [Forms & Validation](./forms.md) for mutation patterns in form submissions. For library reference, see the [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview), [tRPC docs](https://trpc.io/docs/client/react), and [Jotai docs](https://jotai.org/docs/introduction).
