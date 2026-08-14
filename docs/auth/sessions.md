---
outline: [2, 3]
---

# Sessions & Protected Routes

Session state is managed exclusively through TanStack Query. The auth client fetches session data, TanStack Query caches it, and route guards use the cache to protect pages – no direct `auth.useSession()` calls or local storage.

## Session Query

The session query is defined in `apps/app/lib/queries/session.ts`:

```ts
export function sessionQueryOptions() {
  return queryOptions<SessionData | null>({
    queryKey: ["auth", "session"],
    queryFn: async () => {
      const response = await auth.getSession();
      if (response.error) throw response.error;
      return response.data;
    },
    staleTime: 30_000, // 30 seconds
    retry(failureCount, error) {
      const status = getErrorStatus(error);
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
  });
}
```

Key behaviors:

- Returns `null` when unauthenticated (not an error)
- 30-second stale time keeps auth state current without excessive requests
- 401/403 errors are not retried – retrying won't help for auth failures
- Everything else follows the shared `QueryClient` – see [State & Data Fetching](/frontend/state)

### Session Data Shape

```ts
interface SessionData {
  user: User; // id, name, email, emailVerified, image, ...
  session: Session; // id, token, expiresAt, activeOrganizationId, ...
}
```

Both `user` and `session` must be present for valid auth state. Partial data (only user, only session) is treated as unauthenticated.

### Reading Session Data

```ts
// In components – triggers fetch if stale
const { data } = useSessionQuery();

// Sync check of cache only – no network request
const session = getCachedSession(queryClient);
const loggedIn = isValidSession(session);
```

## Protected Route Guard

The `(app)/route.tsx` layout route protects all app pages with a cache-first auth check:

```ts
// apps/app/routes/(app)/route.tsx
export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context, location }) => {
    // Check cache first – instant navigation if session is cached
    let session = getCachedSession(context.queryClient);

    // Fetch only if cache is empty (first load or after cache clear)
    if (session === undefined) {
      session = await context.queryClient.fetchQuery(sessionQueryOptions());
    }

    if (!isValidSession(session)) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      });
    }
  },
  component: AppLayout,
});
```

This pattern means:

- **Cached session** → navigation is instant (no network request)
- **No cache** → fetches session, redirects to `/login` if unauthenticated
- **`returnTo`** → preserves the original URL so users land back after login

`beforeLoad` returns nothing: pages read the session through `useSessionQuery()`, and a copy placed in route context would go stale the moment the session is revalidated.

`isValidSession()` is the single definition of "authenticated". `beforeLoad`, `SessionGate` below, and the login and signup guards all call it, so the partial-data rule can't drift between them.

### Mounted-Session Gate

`beforeLoad` runs when the router loads or invalidates a route, not when a mounted query changes on its own. That leaves a gap: `revalidateSession()` removes the cached session while the app stays mounted, and a background refetch can discover an expired one with no navigation in flight. Both leave mounted pages reading a missing session as a signed-out one. `SessionGate` closes that gap:

```tsx
function AppLayout() {
  return (
    <AuthErrorBoundary>
      <Layout>
        <SessionGate>
          <Outlet />
        </SessionGate>
      </Layout>
    </AuthErrorBoundary>
  );
}

function SessionGate({ children }: { children: ReactNode }) {
  const { data: session, isPending, error } = useSessionQuery();
  const router = useRouter();
  const valid = isValidSession(session);

  // Nothing else would move the user off a page that is already mounted.
  useEffect(() => {
    if (!isPending && !valid) void router.invalidate();
  }, [isPending, valid, router]);

  if (error) throw error;
  if (isPending || !valid) return <p>Loading...</p>;

  return children;
}
```

`beforeLoad` owns redirects; `SessionGate` owns the mounted subtree and hands an invalid session back to the router rather than redirecting itself, so `returnTo` is built in one place. Errors go to `AuthErrorBoundary`, which offers sign-in recovery on a 401.

Because the gate withholds children until the session is known, pages below it read `useSessionQuery()` directly and never handle its pending or error state.

## Login Page

The login route (`(auth)/login.tsx`) handles the inverse – redirecting authenticated users away:

```ts
// apps/app/routes/(auth)/login.tsx
export const Route = createFileRoute("/(auth)/login")({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    try {
      const session = await context.queryClient.fetchQuery(
        sessionQueryOptions(),
      );
      if (isValidSession(session)) {
        throw redirect({ to: search.returnTo ?? "/" });
      }
    } catch (error) {
      if (isRedirect(error)) throw error;
      // Fetch errors → show login form
    }
  },
});
```

After successful authentication, the login page revalidates the session and navigates:

```ts
async function handleSuccess() {
  await revalidateSession(queryClient, router);
  await router.navigate({ to: search.returnTo ?? "/" });
}
```

`revalidateSession` removes the cached session (forcing a fresh fetch) and invalidates the router so `beforeLoad` re-runs with new data.

## Sign Out

`useSignOut()` ends the server session, then clears the cache and hard-redirects:

```ts
// apps/app/lib/queries/session.ts
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(sessionQueryKey, null);
      window.location.href = "/login";
    },
  });
}
```

Everything local happens in `onSuccess`, never unconditionally. Better Auth resolves with `{ error }` rather than throwing, so a discarded error would clear the session locally while the server still honours it – and the login guard would find that session and send the user straight back into the app. `UserMenu` renders `signOut.error` for the same reason.

The hard redirect drops all in-memory state – Jotai atoms, component state, TanStack Query cache – so nothing carries over to the next user. `setQueryData(null)` beats `invalidateQueries` because a session is binary state: there is nothing worth refetching.

## Auth Error Boundary

The `AuthErrorBoundary` wraps protected route layouts and catches authentication errors that occur during rendering (e.g., a tRPC call returns 401):

```ts
// apps/app/components/auth/auth-error-boundary.tsx
export function AuthErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={AuthAwareErrorFallback}
      onError={(error) => {
        if (isUnauthenticatedError(error)) {
          queryClient.removeQueries({ queryKey: sessionQueryKey });
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

The fallback UI shows two options:

- **Try Again** – resets the error boundary and refetches the session
- **Sign In** – clears session cache and redirects to `/login` with `returnTo`

Auth errors (401) get the auth-specific fallback. Other errors (500, network) get a generic error fallback with a retry button.

## Auth Hint Cookie

The API worker manages a lightweight routing cookie alongside the session. On sign-in, it sets `__Host-auth=1` (HTTPS) or `auth=1` (HTTP dev). On sign-out or invalid session, it clears it.

The web edge worker reads this cookie to decide how to route `/`:

```ts
// apps/web/worker.ts
const hasAuthHint =
  getCookie(c, "__Host-auth") === "1" || getCookie(c, "auth") === "1";

const upstream = hasAuthHint ? c.env.APP_SERVICE : c.env.ASSETS;
```

This cookie is **not a security boundary** – it's a performance optimization. False positives (stale cookie after session expiry) cause one extra redirect to `/login`. The app worker is always the authority for session validation.

The cookie lifecycle is managed by Better Auth hooks:

| Event                                 | Action             |
| ------------------------------------- | ------------------ |
| New session (sign-in, sign-up, OAuth) | Set cookie         |
| Sign-out                              | Clear cookie       |
| Session check with no valid session   | Clear stale cookie |

See [ADR-001](/adr/001-auth-hint-cookie) for the design rationale.
