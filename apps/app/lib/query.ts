/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { AppRouter } from "@repo/api";
import { QueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 2 minutes - prevents redundant API calls during
      // typical user sessions while ensuring data updates within reasonable time
      staleTime: 2 * 60 * 1000,
      // Garbage collection after 5 minutes - balances memory usage with instant
      // data availability when navigating back to recently viewed pages
      gcTime: 5 * 60 * 1000,
      // Retry strategy: 3 attempts with exponential backoff (1s, 2s, 4s) capped at 30s
      // Handles transient network issues without overwhelming the server
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Auto-refetch when user returns to tab - ensures displayed data is current
      // after context switches (critical for collaborative features)
      refetchOnWindowFocus: true,
      // Always refetch after network reconnection - prevents stale data after
      // connectivity issues (overrides staleTime check)
      refetchOnReconnect: "always",
    },
    mutations: {
      // Single retry for mutations - prevents duplicate operations while handling
      // momentary network blips (user can manually retry for persistent failures)
      retry: 1,
      retryDelay: 1000,
      // Global error handler for mutations
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

// Set tRPC-specific defaults for better offline support
queryClient.setQueryDefaults(["trpc"], {
  networkMode: "offlineFirst",
});

// Global error handler for auth issues
queryClient.setMutationDefaults(["trpc"], {
  onError: (error) => {
    if (error instanceof TRPCClientError) {
      const trpcError = error as TRPCClientError<AppRouter>;
      // Handle 401 unauthorized errors
      if (
        trpcError.data?.code === "UNAUTHORIZED" ||
        trpcError.message?.includes("401")
      ) {
        // Trigger re-authentication flow
        window.location.href = "/login";
      }
    }
  },
});
