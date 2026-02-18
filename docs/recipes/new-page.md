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

## 2. Add navigation

Open the sidebar or header component and add a link:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/projects" className="...">
  Projects
</Link>;
```

`<Link>` is type-safe – TypeScript will error if the route doesn't exist.

## 3. Fetch data

Use a tRPC query hook inside the component:

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpcClient } from "@/lib/trpc";
import { queryOptions } from "@tanstack/react-query";

function projectsQueryOptions() {
  return queryOptions({
    queryKey: ["projects"],
    queryFn: () => trpcClient.project.list.query(),
  });
}

function Projects() {
  const { data } = useSuspenseQuery(projectsQueryOptions());

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

See [State & Data Fetching](/frontend/state) for more patterns.

## 4. Add search params (optional)

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

## 5. Add a public page (optional)

To create a page that doesn't require authentication, place it under the `(auth)` layout group or directly in `routes/`:

```
apps/app/routes/(auth)/pricing.tsx
```

Pages outside `(app)/` skip the auth guard and don't render the app shell layout.

## Reference

- [Routing](/frontend/routing) – file conventions, layouts, and route guards
- [TanStack Router docs](https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing)
