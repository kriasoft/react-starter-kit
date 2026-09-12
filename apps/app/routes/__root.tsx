import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { AppErrorBoundary } from "#components/auth";
import { Devtools } from "#components/devtools";

// Only queryClient in context - needed for beforeLoad prefetching.
// Auth client is a singleton (no hook equivalent in Better Auth).
export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: Root,
});

export function Root() {
  return (
    <>
      <AppErrorBoundary>
        <Outlet />
      </AppErrorBoundary>
      <Devtools />
    </>
  );
}
