# Add a Page

This recipe walks through adding a new route to the app. All routes live in `apps/app/routes/` and are auto-discovered by [TanStack Router](https://tanstack.com/router/latest).

## 1. Create the route file

Add a file under the `(app)` layout group so it inherits the auth guard and shell layout:

```
apps/app/routes/(app)/projects.tsx
```

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/projects")({
  component: Projects,
});

function Projects() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <p className="text-muted-foreground">Your projects will appear here.</p>
    </div>
  );
}
```

Run `bun app:dev` – TanStack Router regenerates `lib/routeTree.gen.ts` automatically and the page is available at `/projects`.

## 2. Let the edge route it

The web worker forwards a fixed list of top-level paths to the app worker. Add every new top-level path to `APP_PATHS` in `apps/web/worker.ts`:

```ts
const APP_PATHS = [
  "_app",
  "login",
  "members",
  "projects", // [!code ++]
  "settings",
  "signup",
] as const;
```

Skip this and the page works when you click a link but 404s on direct load or refresh – client-side navigation never reaches the edge. The path must also not collide with a marketing page in `apps/web/pages/`, which the web worker serves itself. `apps/app/lib/edge-routing.test.ts` fails on both mistakes.

## 3. Add navigation

Open the sidebar or header component and add a link:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/projects" className="...">
  Projects
</Link>;
```

`<Link>` is type-safe – TypeScript will error if the route doesn't exist.

## 4. Fetch data

Call a query module rather than `trpcClient`, so the cache key has one owner. `useProjectList` comes from [Add a tRPC Procedure](/recipes/new-procedure), which builds both the procedure and the module:

```tsx
import { useProjectList } from "@/lib/queries/project";

function Projects() {
  const { data, isPending, error } = useProjectList();

  if (error) return <p className="p-6">Could not load projects.</p>;
  if (isPending) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ul>
        {data.projects.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Handle `error` and `isPending` before reading `data` – the app mounts no Suspense boundary, so a suspending hook has nothing to fall back to.

See [State & Data Fetching](/frontend/state) for more patterns.

## 5. Add search params (optional)

Validate query string parameters with Zod:

```tsx
import { z } from "zod";

const searchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
});

export const Route = createFileRoute("/(app)/projects")({
  validateSearch: searchSchema,
  component: Projects,
});

function Projects() {
  const { page, q } = Route.useSearch();
  // ...
}
```

## 6. Add a public page (optional)

To create a page that doesn't require authentication, place it under the `(auth)` layout group:

```
apps/app/routes/(auth)/invite.tsx
```

Pages outside `(app)/` skip the auth guard and don't render the app shell layout. They still need their path in `APP_PATHS`.

Marketing pages are a different thing: `/`, `/about`, `/features` and `/pricing` are Astro pages in `apps/web/pages/`, served by the web worker. Adding an app route with one of those names shadows the marketing page, so pick a path the marketing site doesn't own.

## Reference

- [Routing](/frontend/routing) – file conventions, layouts, and route guards
- [TanStack Router docs](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
