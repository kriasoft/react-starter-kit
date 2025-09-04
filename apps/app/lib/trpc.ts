/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import type { AppRouter } from "@repo/api";
import { httpBatchLink, loggerLink } from "@trpc/client";
import type { CreateTRPCReact } from "@trpc/react-query";
import { createTRPCReact } from "@trpc/react-query";

export const api: CreateTRPCReact<AppRouter, unknown> =
  createTRPCReact<AppRouter>();

// Build links array conditionally based on environment
const links = [];

// Add logger link in development for debugging
if (import.meta.env.DEV) {
  links.push(
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
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

export const trpcClient = api.createClient({
  links,
});
