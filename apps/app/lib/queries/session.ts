/**
 * @file Session state managed exclusively via TanStack Query.
 *
 * Do not use direct auth.getSession() calls or local storage for sessions.
 * TanStack Query handles caching, refresh, and consistency automatically.
 */

import { getErrorStatus } from "@/lib/errors";
import type { QueryClient } from "@tanstack/react-query";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { auth, type Session, type User } from "../auth";

// Both user and session must be present for valid auth state
export interface SessionData {
  user: User;
  session: Session;
}

export const sessionQueryKey = ["auth", "session"] as const;

// Returns null when unauthenticated (not an error condition).
// Only overrides staleTime and retry — inherits gcTime, refetchOnWindowFocus,
// refetchOnReconnect, and retryDelay from QueryClient defaults.
export function sessionQueryOptions() {
  return queryOptions<SessionData | null>({
    queryKey: sessionQueryKey,
    queryFn: async () => {
      const response = await auth.getSession();
      if (response.error) {
        throw response.error;
      }
      return response.data;
    },
    // Shorter freshness than global 2min — auth state should stay current
    staleTime: 30_000,
    // Don't retry 401/403 — retrying won't help for auth/permission errors
    retry(failureCount, error) {
      const status = getErrorStatus(error);
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
  });
}

export function useSessionQuery() {
  return useQuery(sessionQueryOptions());
}

export function useSuspenseSessionQuery() {
  return useSuspenseQuery(sessionQueryOptions());
}

export function getCachedSession(
  queryClient: QueryClient,
): SessionData | null | undefined {
  return queryClient.getQueryData(sessionQueryKey);
}

// Sync check of cached data only - does not trigger network request.
// Both user AND session must exist to handle partial data edge cases.
export function isAuthenticated(queryClient: QueryClient): boolean {
  const session = getCachedSession(queryClient);
  return session?.user != null && session?.session != null;
}

// Clears server session, then updates cache and redirects.
// Uses setQueryData(null) instead of invalidateQueries to avoid a wasted
// refetch — session is binary state, not partially stale data.
// Hard redirect resets all in-memory state (Jotai atoms, component state)
// for a clean slate between user sessions.
export async function signOut(
  queryClient: QueryClient,
  options?: { redirect?: boolean },
) {
  try {
    await auth.signOut();
  } finally {
    queryClient.setQueryData(sessionQueryKey, null);

    if (options?.redirect !== false) {
      window.location.href = "/login";
    }
  }
}

/**
 * Clears session cache and revalidates router after auth state changes.
 * Uses removeQueries (not invalidate) so beforeLoad sees undefined and fetches fresh.
 */
export async function revalidateSession(
  queryClient: QueryClient,
  router: { invalidate: () => Promise<void> },
) {
  queryClient.removeQueries({ queryKey: sessionQueryKey });
  await router.invalidate();
}
