# State & Data Fetching

Server state is managed with [TanStack Query](https://tanstack.com/query/latest). Query modules call either the tRPC client or the Better Auth client, depending on which system owns the operation. Client state uses [Jotai](https://jotai.org/) atoms when needed.

## tRPC Client

`apps/app/lib/trpc.ts` exports one thing – the tRPC client:

```tsx
import { trpcClient } from "@/lib/trpc";
```

It sends requests to `/api/trpc` with batched HTTP transport and includes credentials for cookie-based auth. A logger link is added in development.

Call it from a query module rather than from a component, so each cache key is written once. That is the pattern the rest of this page follows.

## QueryClient Defaults

`apps/app/lib/query.ts` sets only what this project decided differently from [TanStack Query's own defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults), so nothing here goes stale when upstream changes its mind.

| Option | Value | Why |
| --- | --- | --- |
| `staleTime` | 2 min | Upstream defaults to `0`, which refetches on nearly every mount |
| `refetchOnReconnect` | `"always"` | Default `true` still honours `staleTime`; after connectivity loss, data age says nothing about correctness |
| `mutations.retry` | `false` | Matches upstream, stated because it is a safety invariant |

Mutations are never retried. A lost response looks exactly like a failed request, so retrying a create can run it twice on the server and still report failure. Opt in per mutation where the operation is idempotent.

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

| Export | Purpose |
| --- | --- |
| `useSessionQuery()` | Basic hook |
| `getCachedSession(queryClient)` | Sync cache read (no network) |
| `isValidSession(session)` | Type guard – requires both `user` and `session` |
| `useSignOut()` | Mutation – ends the server session, then clears the cache and hard redirects |
| `revalidateSession(queryClient, router)` | Removes cached query so `beforeLoad` fetches fresh |

## Query Modules

A query module owns the cache key and the freshness rules for one slice of server state. Components consume the module, never `trpcClient` directly. The billing module is the one to copy:

```tsx
// apps/app/lib/queries/billing.ts
export const billingQueryKey = ["billing", "subscription"] as const;

export function billingQueryOptions(activeOrgId?: string | null) {
  return queryOptions({
    queryKey: [...billingQueryKey, activeOrgId ?? null] as const,
    queryFn: () => trpcClient.billing.subscription.query(),
  });
}

export function useBillingQuery(activeOrgId?: string | null) {
  return useQuery(billingQueryOptions(activeOrgId));
}
```

`billingQueryKey` is the prefix for bulk invalidation; putting `activeOrgId` in the full key makes switching organizations refetch instead of showing another tenant's data. The same options factory works in a component, a route `beforeLoad`, a prefetch, and a test – which is what keeps the key from drifting.

Not every module wraps tRPC. `apps/app/lib/queries/organization.ts` calls the Better Auth client, because the organization plugin already enforces membership and roles server-side.

## Reading a Query in a Component

Handle `error` and `isPending` before reading `data`, so a failed request never renders as a known answer. Without those guards `BillingCard` (`apps/app/routes/(app)/settings.tsx`) would tell a paying customer they are on the free plan:

```tsx
function BillingCard() {
  const { data: session } = useSessionQuery();
  const activeOrgId = session?.session?.activeOrganizationId;
  const { data: billing, isPending, error } = useBillingQuery(activeOrgId);

  if (error) return <BillingNotice>Could not load billing.</BillingNotice>;
  if (isPending) return <BillingNotice>Loading...</BillingNotice>;
  if (!billing.enabled) return null;

  // `billing` is known from here on
}
```

Guard on `isPending` rather than `isLoading`. `isLoading` is `isPending && isFetching`, so it reads false while a request is paused offline or skipped with `skipToken` – both cases where `data` is still unknown.

## Mutations

Mutations live in the query module too, next to the queries they invalidate – that is why `useCreateOrganization` sits in `organization.ts` and the Stripe redirects sit in `billing.ts`. No working tRPC mutation ships in the starter; after adding a `project.create` procedure it would look like this:

```tsx
// apps/app/lib/queries/project.ts
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      trpcClient.project.create.mutate(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: projectQueryKey }),
  });
}
```

The component picks the hook and reads its state:

```tsx
import { useCreateProject } from "@/lib/queries/project";

function CreateProjectButton() {
  const createProject = useCreateProject();

  return (
    <button
      onClick={() => createProject.mutate({ name: "Roadmap" })}
      disabled={createProject.isPending}
    >
      Create Project
    </button>
  );
}
```

## Cache Invalidation

Invalidate by query key prefix to refresh related data after mutations:

```tsx
// Invalidate all project queries
queryClient.invalidateQueries({ queryKey: projectQueryKey });

// Invalidate all billing queries (any org)
queryClient.invalidateQueries({ queryKey: ["billing", "subscription"] });
```

For session changes, use `removeQueries` instead of `invalidateQueries` – this forces `beforeLoad` guards to fetch fresh data rather than serving stale cache:

```tsx
queryClient.removeQueries({ queryKey: ["auth", "session"] });
await router.invalidate();
```

## Jotai Store

A global Jotai store is set up in `apps/app/lib/store.ts` and wired into the app via `StoreProvider`. Reach for it only when client state genuinely crosses a component or route boundary – TanStack Query owns server state, and `useState` handles the rest. The sidebar stays local in `components/layout/index.tsx` for exactly that reason: nothing outside that subtree reads it.

Theme is the shipped case, in `apps/app/lib/theme.tsx` – an inline script, the settings page, and every component that renders differently in dark mode all read the same value:

```tsx
import { atom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";

const themePreferenceAtom = atomWithStorage<ThemePreference>("theme", "system");

// Derived, never stored: "system" resolves against the OS setting.
const themeAtom = atom<Theme>((get) => {
  const preference = get(themePreferenceAtom);
  return preference === "system" ? get(systemThemeAtom) : preference;
});
```

See [Forms & Validation](./forms.md) for mutation patterns in form submissions. For library reference, see the [TanStack Query docs](https://tanstack.com/query/latest/docs/framework/react/overview), [tRPC docs](https://trpc.io/docs/client/react), and [Jotai docs](https://jotai.org/docs/introduction).
