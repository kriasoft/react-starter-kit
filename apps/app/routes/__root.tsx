import { AuthErrorBoundary } from "@/components/auth/auth-error-boundary";
import type { AuthClient } from "@/lib/auth";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRouteWithContext<{
  auth: AuthClient;
  queryClient: QueryClient;
}>()({
  component: Root,
});

export function Root() {
  return (
    <AuthErrorBoundary>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </AuthErrorBoundary>
  );
}
