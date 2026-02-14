Client-side SPA — no SSR. All rendering happens in the browser.

## Routing

- File-based routing in `routes/`. `lib/routeTree.gen.ts` is auto-generated — never edit it.
- Route groups: `(app)/` = protected, `(auth)/` = public. Parentheses don't affect URLs.
- `route.tsx` in a group = layout with shared `beforeLoad`; individual files for pages.

## Authentication

- Session state via `useSessionQuery()` from `lib/queries/session.ts`. NEVER use `auth.useSession()` — TanStack Query provides caching, multi-tab sync, and consistency.
- Auth guard in `beforeLoad`, not in components. Uses cache-first (`getCachedSession()`), then `fetchQuery()`.
- Must validate both `user` AND `session` (not just one).
- After login: call `revalidateSession(queryClient, router)` — removes cache + invalidates router so `beforeLoad` fetches fresh data, then navigate.
- Safe redirects: use `getSafeRedirectUrl()` for `returnTo` search params (prevents open redirects).
- `signOut(queryClient)` clears server session, invalidates cache, redirects to `/login`.

## tRPC Client

- `credentials: "include"` for cookie-based auth, batched via `httpBatchLink`.
- API URL: `${import.meta.env.VITE_API_URL || "/api"}/trpc`.
- Uses `createTRPCOptionsProxy()` for TanStack Query integration.

## Components

- Named exports, functional only. shadcn/ui from `@repo/ui`.
- Navigation: `<Link>` from TanStack Router with `activeProps` for active styling. Never use `<a>` for internal routes.
- Route context: `Route.useSearch()` for search params, `Route.useRouteContext()` for route data.
- Jotai store available for cross-route UI state (modals, sidebar).

## Error Handling

- `AppErrorBoundary` (root) shows generic error UI. `AuthErrorBoundary` (protected routes) catches 401/UNAUTHORIZED and shows sign-in recovery UI; 403 falls through to generic handler.
- Utilities in `lib/errors.ts`: `getErrorStatus()`, `isUnauthenticatedError()`, `getErrorMessage()`.
