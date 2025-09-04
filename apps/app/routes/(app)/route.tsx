/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Layout } from "@/components/layout";
import { getCachedSession, sessionQueryOptions } from "@/lib/queries/session";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)")({
  // ARCHITECTURE: Route-level authentication guard
  // This runs before any protected route renders, ensuring unauthorized
  // users never see protected content (even briefly).
  //
  // DESIGN: Cache-first auth check strategy
  // 1. Check cache first (instant, no network call)
  // 2. Only fetch from server if cache is empty (initial load)
  // This makes navigation between protected routes instant while
  // maintaining security on first load.
  beforeLoad: async ({ context, location }) => {
    // First check if we have a cached session (avoids network request)
    let session = getCachedSession(context.queryClient);

    // Only fetch if cache is empty (initial load or after invalidation)
    if (session === undefined) {
      // Ensure session data is available using the query options
      session = await context.queryClient.fetchQuery(sessionQueryOptions());
    }

    // Check both user AND session exist to ensure valid auth state
    // Better Auth can return partial data during edge cases
    if (!session?.user || !session?.session) {
      // Validate redirect URL to prevent open redirect attacks
      const currentPath = location.pathname + location.search;
      const safeRedirect = currentPath.startsWith("/") ? currentPath : "/";

      throw redirect({
        to: "/login",
        search: {
          redirect: safeRedirect,
        },
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
