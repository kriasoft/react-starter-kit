import { QueryClient } from "@tanstack/react-query";

// Only what this project decided differently from TanStack Query's defaults.
// Restating a default invites someone to "tune" it, and goes stale the day
// upstream changes its mind.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Navigating back to a page just loaded is free, without anyone
      // staring at minutes-old data.
      staleTime: 2 * 60 * 1000,
      // "always", not the default `true`: after connectivity loss the age of
      // the data says nothing about whether it is still correct.
      refetchOnReconnect: "always",
    },
    mutations: {
      // Upstream default, restated because it is a safety invariant: a lost
      // response is indistinguishable from a failed request, so a retried
      // create can run twice. Opt in per mutation where it is idempotent.
      retry: false,
      onError: (error) => console.error("Mutation failed:", error),
    },
  },
});
