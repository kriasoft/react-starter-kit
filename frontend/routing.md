---
url: /frontend/routing.md
---
# Routing

The app uses [TanStack Router](https://tanstack.com/router/latest) with file-based routing. Routes are defined as files in `apps/app/routes/` and TanStack Router generates a typed route tree automatically.

## Route File Convention

Each file in `routes/` becomes a route. The file path determines the URL:

```bash
apps/app/routes/
├── __root.tsx              → Root layout (wraps everything)
├── (auth)/
│   ├── login.tsx           → /login
│   └── signup.tsx          → /signup
└── (app)/
    ├── route.tsx           → Layout for all (app) routes
    ├── index.tsx           → / (dashboard)
    ├── settings.tsx        → /settings
    ├── users.tsx           → /users
    ├── analytics.tsx       → /analytics
    ├── reports.tsx         → /reports
    ├── dashboard.tsx       → /dashboard (redirects to /)
    └── about.tsx           → /about
```

Parenthesized directories like `(app)` and `(auth)` are **route groups** – they create layout boundaries without affecting the URL. `/settings` is the URL, not `/(app)/settings`.

The generated route tree lives at `apps/app/lib/routeTree.gen.ts`. Don't edit it – run `bun app:dev` and TanStack Router regenerates it on file changes.

## Route Groups

The two route groups serve different auth requirements:

| Group    | Purpose             | Auth behavior                             |
| -------- | ------------------- | ----------------------------------------- |
| `(app)`  | Protected app pages | Redirects to `/login` if unauthenticated  |
| `(auth)` | Login/signup pages  | Redirects to `/` if already authenticated |

## Root Route

The root route (`__root.tsx`) creates the router context and wraps everything in an error boundary:

```tsx
// apps/app/routes/__root.tsx
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Root,
});

function Root() {
  return (
    <AppErrorBoundary>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AppErrorBoundary>
  );
}
```

The `queryClient` in context is what makes `beforeLoad` guards possible – route guards can prefetch or read cached data before rendering.

## Auth Guards

### Protecting app routes

The `(app)/route.tsx` layout guard uses a cache-first strategy for instant navigation:

```tsx
// apps/app/routes/(app)/route.tsx
export const Route = createFileRoute("/(app)")({
  beforeLoad: async ({ context, location }) => {
    // Check cache first – instant when data exists
    let session = getCachedSession(context.queryClient);

    // Fetch only if cache is empty (first visit or after sign-out)
    if (session === undefined) {
      session = await context.queryClient.fetchQuery(sessionQueryOptions());
    }

    // Both user and session must exist for valid auth state
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

This pattern makes subsequent navigations between protected routes instant – the session is already cached from the first load.

### Redirecting authenticated users

Login and signup routes redirect authenticated users away:

```tsx
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
      // Show login form for fetch errors
    }
  },
  component: LoginPage,
});
```

## Search Params

Validate and transform search params with Zod. The login route sanitizes `returnTo` to prevent open redirects:

```tsx
const searchSchema = z.object({
  returnTo: z
    .string()
    .optional()
    .transform((val) => {
      const safe = getSafeRedirectUrl(val);
      return safe === "/" ? undefined : safe;
    })
    .catch(undefined),
});
```

Access validated search params in the component:

```tsx
function LoginPage() {
  const search = Route.useSearch();
  // search.returnTo is guaranteed safe – validated at parse time
}
```

## Navigation

Use the `<Link>` component for type-safe navigation:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/settings">Settings</Link>

// Active styling
<Link
  to="/settings"
  activeProps={{ className: "font-bold text-primary" }}
>
  Settings
</Link>

// With search params
<Link to="/login" search={{ returnTo: "/settings" }}>
  Log in
</Link>
```

For programmatic navigation:

```tsx
const router = useRouter();
await router.navigate({ to: "/settings" });
```

## Adding a New Route

1. Create a route file:

```tsx
// apps/app/routes/(app)/projects.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/projects")({
  component: Projects,
});

function Projects() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Projects</h2>
    </div>
  );
}
```

2. The route tree regenerates automatically during `bun app:dev`. The new page is available at `/projects` and protected by the `(app)` layout guard.

3. Add navigation in the sidebar or header as needed. See [State & Data Fetching](./state.md) for loading data in your new route.

For more on TanStack Router, see the [official docs](https://tanstack.com/router/latest/docs/framework/react/overview).
