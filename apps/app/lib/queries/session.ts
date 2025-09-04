/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { QueryClient } from "@tanstack/react-query";
import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { Session, User } from "better-auth/types";
import { auth } from "../auth";

/**
 * ARCHITECTURE DECISION: Single Source of Truth for Session Management
 *
 * This module is the ONLY place where session state should be accessed.
 * We deliberately do NOT use:
 * - Separate timer-based session refresh (handled by TanStack Query)
 * - Direct auth.getSession() calls outside this module
 * - Local/session storage for auth state (security risk)
 *
 * TanStack Query provides all necessary session management:
 * - Automatic refresh on window focus (line 40)
 * - Network reconnection handling (line 42)
 * - Smart caching with stale/fresh data (lines 36-38)
 * - Exponential backoff retry logic (lines 44-51)
 *
 * This eliminates race conditions and ensures consistent auth state.
 */

// Session response type from Better Auth
// NOTE: Both user and session must be present for valid auth state
export interface SessionData {
  user: User;
  session: Session;
}

// Query key for session data
export const sessionQueryKey = ["auth", "session"] as const;

// Session query options factory
// Returns null when unauthenticated (not an error condition)
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
    // DESIGN: Session freshness strategy
    // Sessions stay fresh for 30s to minimize server calls while ensuring
    // reasonably up-to-date auth state. This balances performance vs freshness.
    staleTime: 30_000,

    // DESIGN: Cache retention for 5 minutes
    // Keeps session in memory even when components unmount, preventing
    // unnecessary re-fetches during navigation. Must be >= staleTime.
    gcTime: 5 * 60_000,

    // DESIGN: Auto-refresh on tab focus
    // Critical for multi-tab scenarios - ensures session is fresh when
    // user returns to the app. Replaces need for timer-based refresh.
    refetchOnWindowFocus: true,

    // DESIGN: Network recovery strategy
    // Always refetch after network issues to sync with server state.
    // Better Auth maintains server-side sessions, client must stay in sync.
    refetchOnReconnect: "always",
    // Retry strategy: 3 attempts for network errors, skip auth errors
    retry(failureCount, error) {
      // Don't retry auth errors - user must re-authenticate
      // Better Auth errors have a status property on the error object
      const status = (error as { status?: number })?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Hook for using session data with loading states
export function useSessionQuery() {
  return useQuery(sessionQueryOptions());
}

// Hook for using session data with suspense
export function useSuspenseSessionQuery() {
  return useSuspenseQuery(sessionQueryOptions());
}

// Prefetch session data
export async function prefetchSession(queryClient: QueryClient) {
  return queryClient.prefetchQuery(sessionQueryOptions());
}

// Invalidate session cache (useful after login/logout)
export async function invalidateSession(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: sessionQueryKey });
}

// Set session data optimistically
export function setSessionData(
  queryClient: QueryClient,
  data: SessionData | null,
) {
  queryClient.setQueryData(sessionQueryKey, data);
}

// Get cached session data without refetching
export function getCachedSession(
  queryClient: QueryClient,
): SessionData | null | undefined {
  return queryClient.getQueryData(sessionQueryKey);
}

// Check if user is authenticated (sync check of cache)
// WARNING: Only checks cached data, does not trigger network request
// Use useSessionQuery() for reactive auth state in components
//
// DESIGN: Why both user AND session must exist:
// Better Auth can return partial data during edge cases (e.g., session
// expiry, database issues). Checking both ensures valid auth state.
export function isAuthenticated(queryClient: QueryClient): boolean {
  const session = getCachedSession(queryClient);
  return session?.user != null && session?.session != null;
}

// Enhanced sign out with session invalidation and redirect
// NOTE: Clears server session first, then invalidates all auth caches
// This ensures clean state even if cache invalidation fails
export async function signOut(
  queryClient: QueryClient,
  options?: { redirect?: boolean },
) {
  // Perform the actual sign out first
  await auth.signOut();

  // Then clear all auth-related caches
  await queryClient.invalidateQueries({ queryKey: ["auth"] });

  // Redirect to login page by default
  if (options?.redirect !== false) {
    window.location.href = "/login";
  }
}

// Refresh session manually
// Only re-fetches if query is currently active (mounted in a component)
export async function refreshSession(queryClient: QueryClient) {
  return queryClient.refetchQueries({
    queryKey: sessionQueryKey,
    type: "active",
  });
}
