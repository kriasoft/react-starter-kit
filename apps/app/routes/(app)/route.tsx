import { Layout } from "@/components/layout";
import { getCachedSession, sessionQueryOptions } from "@/lib/queries/session";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
  // Route-level authentication guard using cache-first strategy.
  // Checks cache before fetching to make navigation instant.
  beforeLoad: async ({ context, location }) => {
    let session = getCachedSession(context.queryClient);

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

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
