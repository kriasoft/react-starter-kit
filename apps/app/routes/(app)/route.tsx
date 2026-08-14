import { AuthErrorBoundary } from "@/components/auth";
import { Layout } from "@/components/layout";
import {
  getCachedSession,
  isValidSession,
  sessionQueryOptions,
  useSessionQuery,
} from "@/lib/queries/session";
import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

export const Route = createFileRoute("/(app)")({
  // Route-level authentication guard using cache-first strategy.
  // Checks cache before fetching to make navigation instant.
  beforeLoad: async ({ context, location }) => {
    let session = getCachedSession(context.queryClient);

    if (session === undefined) {
      session = await context.queryClient.fetchQuery(sessionQueryOptions());
    }

    // Nothing is returned into route context: `SessionGate` below makes the
    // query the single source of truth for the mounted tree, and a copy taken
    // here would go stale the moment the session is revalidated.
    if (!isValidSession(session)) {
      throw redirect({
        to: "/login",
        search: { returnTo: location.href },
      });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <AuthErrorBoundary>
      <Layout>
        <SessionGate>
          <Outlet />
        </SessionGate>
      </Layout>
    </AuthErrorBoundary>
  );
}

/**
 * `beforeLoad` guarantees a session at mount, but `revalidateSession()` empties
 * the cache while the app stays mounted, so pages would briefly read a missing
 * session as a signed-out one with no organization. Holding the outlet until it
 * resolves is what lets every page below read the session directly.
 *
 * Errors go to the boundary above, which offers sign-in recovery on a 401.
 */
function SessionGate({ children }: { children: ReactNode }) {
  const { data: session, isPending, error } = useSessionQuery();
  const router = useRouter();
  const valid = isValidSession(session);

  // A focus or reconnect refetch can discover an expired session with no
  // navigation in flight, so nothing would otherwise move the user off this
  // page. Re-running `beforeLoad` performs the redirect, `returnTo` and all.
  useEffect(() => {
    if (!isPending && !valid) void router.invalidate();
  }, [isPending, valid, router]);

  if (error) throw error;
  if (isPending || !valid) {
    return <p className="p-6 text-sm text-muted-foreground">Loading...</p>;
  }

  return children;
}
