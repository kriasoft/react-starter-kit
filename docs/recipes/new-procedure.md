# Add a tRPC Procedure

This recipe adds a new tRPC procedure with input validation and wires it up from the API to the frontend.

::: tip Prerequisite

The example continues the `project` table from [Add a Database Table](./new-table.md) – complete its steps 1–3 first, or the schema references below will not compile.

:::

## 1. Create the router file

Add a new router in `apps/api/routers/`:

```ts
// apps/api/routers/project.ts
import { z } from "zod";
import { schema } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../lib/trpc.js";

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const organizationId = ctx.session.activeOrganizationId;
    if (!organizationId) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "Select an organization first",
      });
    }

    const membership = await ctx.db.query.member.findFirst({
      where: (m, { and, eq }) =>
        and(eq(m.userId, ctx.user.id), eq(m.organizationId, organizationId)),
    });
    if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

    const projects = await ctx.db.query.project.findMany({
      where: (p, { eq }) => eq(p.organizationId, organizationId),
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
      const organizationId = ctx.session.activeOrganizationId;
      if (!organizationId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Select an organization first",
        });
      }

      const membership = await ctx.db.query.member.findFirst({
        where: (m, { and, eq }) =>
          and(eq(m.userId, ctx.user.id), eq(m.organizationId, organizationId)),
      });
      if (!membership) throw new TRPCError({ code: "FORBIDDEN" });

      const [project] = await ctx.db
        .insert(schema.project)
        .values({
          ...input,
          organizationId,
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
  config: configRouter,
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
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { trpcClient } from "../trpc";

// Stable prefix so every project query can be invalidated at once.
export const projectQueryKey = ["project"] as const;

export function projectListOptions() {
  return queryOptions({
    queryKey: [...projectQueryKey, "list"] as const,
    queryFn: () => trpcClient.project.list.query(),
  });
}

export function useProjectList() {
  return useQuery(projectListOptions());
}

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

Use in a component:

```tsx
import { useProjectList } from "@/lib/queries/project";

function ProjectList() {
  const { data, isPending, error } = useProjectList();

  if (error) return <p>Could not load projects.</p>;
  if (isPending) return <p>Loading...</p>;

  return (
    <ul>
      {data.projects.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## 4. Call a mutation

The module owns the invalidation, so the component only picks a hook:

```tsx
import { useCreateProject } from "@/lib/queries/project";

function CreateProjectButton() {
  const createProject = useCreateProject();

  return (
    <button
      onClick={() => createProject.mutate({ name: "New Project" })}
      disabled={createProject.isPending}
    >
      {createProject.isPending ? "Creating..." : "Create Project"}
    </button>
  );
}
```

## Reference

- [Procedures](/api/procedures) – query vs mutation, public vs protected
- [Validation & Errors](/api/validation-errors) – Zod input schemas and error handling
- [State & Data Fetching](/frontend/state) – TanStack Query patterns
