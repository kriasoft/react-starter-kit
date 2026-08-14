/**
 * @file Session state, owned by TanStack Query alone. Never read the session
 * from `auth.getSession()` or storage directly – a second copy is what lets the
 * UI disagree with the server about who is signed in.
 */

import { getErrorStatus } from "@/lib/errors";
import type { QueryClient } from "@tanstack/react-query";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { auth, type Session, type User } from "../auth";

export interface SessionData {
  user: User;
  session: Session;
}

export const sessionQueryKey = ["auth", "session"] as const;

// Returns null when unauthenticated (not an error condition). Overrides
// staleTime and retry policy; everything else follows the shared QueryClient.
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
    // Shorter freshness than global 2min – auth state should stay current
    staleTime: 30_000,
    // Don't retry 401/403 – retrying won't help for auth/permission errors
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

export function getCachedSession(
  queryClient: QueryClient,
): SessionData | null | undefined {
  return queryClient.getQueryData(sessionQueryKey);
}

/**
 * Both fields must be present: a response carrying only one is not a session
 * anyone is authenticated by. Every auth decision goes through this.
 */
export function isValidSession(
  session: SessionData | null | undefined,
): session is SessionData {
  return session?.user != null && session?.session != null;
}

/**
 * Ends the server session, then clears the cache and hard-redirects.
 *
 * Better Auth resolves with `{ error }` rather than throwing, so the result is
 * checked: signing out locally on a failed request would show a signed-out UI
 * over a session the server still honours, and the login guard would send the
 * user straight back in.
 *
 * `setQueryData(null)` rather than `invalidateQueries` – a session is binary,
 * so there is nothing worth refetching. The redirect then drops all in-memory
 * state, atoms and component state alike, so nothing reaches the next user.
 */
export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(sessionQueryKey, null);
      window.location.href = "/login";
    },
  });
}

/**
 * Clears the session cache and re-runs the router guards after an auth change.
 * `removeQueries`, not `invalidateQueries`, so `beforeLoad` sees `undefined`
 * and fetches rather than reusing the old session.
 */
export async function revalidateSession(
  queryClient: QueryClient,
  router: { invalidate: () => Promise<void> },
) {
  queryClient.removeQueries({ queryKey: sessionQueryKey });
  await router.invalidate();
}
