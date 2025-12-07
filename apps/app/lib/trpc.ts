import type { AppRouter } from "@repo/api";
import {
  createTRPCClient,
  httpBatchLink,
  type TRPCLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { queryClient } from "./query";

// Build links array conditionally based on environment
const links: TRPCLink<AppRouter>[] = [];

// Add logger link in development for debugging
if (import.meta.env.DEV) {
  links.push(
    loggerLink({
      enabled: (opts) =>
        (import.meta.env.DEV && typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
  );
}

// Add HTTP batch link for actual requests
links.push(
  httpBatchLink({
    url: `${import.meta.env.VITE_API_URL || "/api"}/trpc`,
    // Custom headers for request tracking
    headers() {
      return {
        "x-trpc-source": "react-app",
      };
    },
    // Include credentials for authentication
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  }),
);

export const trpcClient = createTRPCClient<AppRouter>({ links });

export const api = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
