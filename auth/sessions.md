---
url: /auth/sessions.md
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

* Returns `null` when unauthenticated (not an error)
* 30-second stale time keeps auth state current without excessive requests
* 401/403 errors are not retried – retrying won't help for auth failures
* Inherits global `gcTime`, `refetchOnWindowFocus`, and `refetchOnReconnect` from QueryClient defaults

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

// With Suspense
const { data } = useSuspenseSessionQuery();

// Sync check of cache only – no network request
const session = getCachedSession(queryClient);
const loggedIn = isAuthenticated(queryClient);
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

    if (!session?.user || !session?.session) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      });
    }

    return { user: session.user, session };
  },
  component: AppLayout,
});
```

This pattern means:

* **Cached session** → navigation is instant (no network request)
* **No cache** → fetches session, redirects to `/login` if unauthenticated
* **`returnTo`** → preserves the original URL so users land back after login

The session data is returned from `beforeLoad` and available to all child routes via `Route.useRouteContext()`.

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
      if (session?.user && session?.session) {
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

The `signOut` function clears the server session, updates the cache, and performs a hard redirect:

```ts
// apps/app/lib/queries/session.ts
export async function signOut(queryClient: QueryClient) {
  try {
    await auth.signOut();
  } finally {
    queryClient.setQueryData(sessionQueryKey, null);
    window.location.href = "/login";
  }
}
```

The hard redirect (`window.location.href`) resets all in-memory state – Jotai atoms, component state, TanStack Query cache – ensuring a clean slate between user sessions. `setQueryData(null)` is used instead of `invalidateQueries` to avoid a wasted refetch of a session that no longer exists.

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

* **Try Again** – resets the error boundary and refetches the session
* **Sign In** – clears session cache and redirects to `/login` with `returnTo`

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
