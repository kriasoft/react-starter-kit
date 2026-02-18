---
url: /recipes/new-procedure.md
---
# Add a tRPC Procedure

This recipe adds a new tRPC procedure with input validation and wires it up from the API to the frontend.

## 1. Create the router file

Add a new router in `apps/api/routers/`:

```ts
// apps/api/routers/project.ts
import { z } from "zod";
import { protectedProcedure, router } from "../lib/trpc.js";

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.query.project.findMany({
      where: (p, { eq }) =>
        eq(p.organizationId, ctx.session.activeOrganizationId!),
      orderBy: (p, { desc }) => desc(p.createdAt),
    });
    return { projects };
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .insert(schema.project)
        .values({
          ...input,
          organizationId: ctx.session.activeOrganizationId!,
        })
        .returning();
      return project;
    }),
});
```

Use `protectedProcedure` for authenticated endpoints and `publicProcedure` for unauthenticated ones. Protected procedures guarantee `ctx.session` and `ctx.user` are non-null.

## 2. Register the router

Import and add it to the app router in `apps/api/lib/app.ts`:

```ts
import { projectRouter } from "../routers/project.js";

const appRouter = router({
  billing: billingRouter,
  user: userRouter,
  organization: organizationRouter,
  project: projectRouter, // [!code ++]
});
```

The procedure is now callable at `/api/trpc/project.list` and `/api/trpc/project.create`.

## 3. Call from the frontend

Create a query options helper in `apps/app/lib/queries/`:

```ts
// apps/app/lib/queries/project.ts
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { trpcClient } from "../trpc";

export function projectListOptions() {
  return queryOptions({
    queryKey: ["projects"],
    queryFn: () => trpcClient.project.list.query(),
  });
}

export function useProjectList() {
  return useQuery(projectListOptions());
}
```

Use in a component:

```tsx
import { useProjectList } from "@/lib/queries/project";

function ProjectList() {
  const { data, isLoading } = useProjectList();

  if (isLoading) return <p>Loading...</p>;

  return (
    <ul>
      {data?.projects.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## 4. Call a mutation

```tsx
import { trpcClient } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";

function CreateProjectButton() {
  const queryClient = useQueryClient();

  async function handleCreate() {
    await trpcClient.project.create.mutate({
      name: "New Project",
    });
    // Invalidate the list so it refetches
    await queryClient.invalidateQueries({ queryKey: ["projects"] });
  }

  return <button onClick={handleCreate}>Create Project</button>;
}
```

## Reference

* [Procedures](/api/procedures) – query vs mutation, public vs protected
* [Validation & Errors](/api/validation-errors) – Zod input schemas and error handling
* [State & Data Fetching](/frontend/state) – TanStack Query patterns
