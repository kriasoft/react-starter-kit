Client-side SPA – no SSR. All rendering happens in the browser.

## Routing

- File-based routing in `routes/`. `lib/routeTree.gen.ts` is auto-generated – never edit it.
- Route groups: `(app)/` = protected, `(auth)/` = public. Parentheses don't affect URLs.
- `route.tsx` in a group = layout with shared `beforeLoad`; individual files for pages.

## Authentication

- Session state via `useSessionQuery()` from `lib/queries/session.ts`. NEVER use `auth.useSession()` – one TanStack Query cache keeps components and route guards consistent.
- Auth guard in `beforeLoad`, not in components. Uses cache-first (`getCachedSession()`), then `fetchQuery()`.
- `SessionGate` in `(app)/route.tsx` holds the outlet until the session query resolves, because `revalidateSession()` empties the cache while the app stays mounted. Pages below it read the session directly and never handle its pending or error state.
- Validity is `isValidSession()` in `lib/queries/session.ts` – both `user` and `session` must be present. `beforeLoad`, `SessionGate`, and the login/signup guards all go through it.
- After login: call `revalidateSession(queryClient, router)` – removes cache + invalidates router so `beforeLoad` fetches fresh data, then navigate.
- Safe redirects: use `getSafeRedirectUrl()` for `returnTo` search params (prevents open redirects).
- `useSignOut()` ends the server session, then writes `null` to the cache and redirects to `/login`. Both happen in `onSuccess` – a failed sign-out must not look like a successful one.

## tRPC Client

- `credentials: "include"` for cookie-based auth, batched via `httpBatchLink`.
- API URL is always the same-origin `/api/trpc` – proxied by the vite dev server, forwarded by the web worker in production.
- `lib/trpc.ts` exports only `trpcClient`. Query modules in `lib/queries/` wrap it in `queryOptions()` factories so each concern has one cache-key definition.
- Not every server call is tRPC. Auth, organization, and Stripe mutations go through the Better Auth client – wrapping them would duplicate a boundary the plugin already enforces. Reads that join plugin state with application data (`billing.subscription`) stay tRPC.

## Components

- Named exports, functional only. shadcn/ui from `@repo/ui`.
- Navigation: `<Link>` from TanStack Router with `activeProps` for active styling, for every route this SPA owns. Crossing to an edge-owned URL needs a document navigation – `<a href="/">` in `auth-form.tsx` is the one case, because `/` is this app's protected dashboard and only the edge router can answer it with the marketing page.
- Route context: `Route.useSearch()` for search params, `Route.useRouteContext()` for data a route's `beforeLoad` actually returns.
- Keep state local until it crosses a component or route boundary. Jotai is for what genuinely does: `lib/theme.tsx` is the shipped case. The sidebar stays `useState` in `components/layout/index.tsx` because only that subtree reads it.

## Theming

- `<html>` is written by exactly two things: the inline script in `index.html` (pre-paint) and `<ThemeSync />` in `lib/theme.tsx` (everything after). Read via `useTheme()`; never toggle the class from a component.
- `preference` is what the user chose (`light` | `dark` | `system`); `theme` is the resolved value (`light` | `dark`) and is derived, never stored.
- Mounting never writes to storage – the default stays absent until the user picks. An absent key and a stored `"system"` behave identically, so don't build logic on the difference.
- That script duplicates the resolution logic on purpose – it runs before the bundle, so dark-mode users don't get a white flash. Its storage key and JSON encoding must match `theme.tsx`; `theme.test.tsx` guards the pair.
- `systemThemeAtom` is lazy so its first read happens during render. Seeding it with a value would repaint a frame after the inline script already got it right – `theme.test.tsx` guards this.
- `--theme-color` in `styles/globals.css` is the source for `<meta name="theme-color">`. `index.html` (both values) and `public/site.manifest` (light) must repeat it, since they load before any stylesheet. Change all three together – no test catches this drift.

## Error Handling

- `AppErrorBoundary` (root) shows generic error UI. `AuthErrorBoundary` (protected routes) catches 401/UNAUTHORIZED and shows sign-in recovery UI; 403 falls through to generic handler.
- `Devtools` mounts as a sibling of `AppErrorBoundary`, not inside it, and carries its own silent boundary – neither can unmount the other.
- Utilities in `lib/errors.ts`: `getErrorStatus()`, `isUnauthenticatedError()`, `getErrorMessage()`.
