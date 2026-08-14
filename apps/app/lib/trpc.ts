import type { AppRouter } from "@repo/api";
import {
  createTRPCClient,
  httpBatchLink,
  loggerLink,
  type TRPCLink,
} from "@trpc/client";

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
    // Always same-origin: the vite dev server proxies /api to API_ORIGIN, and
    // in production the web worker forwards it over a service binding.
    url: "/api/trpc",
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

// Query modules in `lib/queries/` wrap this client in `queryOptions()`
// factories, so cache keys and freshness rules live in one place per concern.
export const trpcClient = createTRPCClient<AppRouter>({ links });
