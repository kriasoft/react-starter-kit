/**
 * @file Cloudflare Workers entrypoint for the web marketing site.
 *
 * Acts as an authentication-aware router for the home page:
 * - Unauthenticated users see marketing content (static assets)
 * - Authenticated users see the app dashboard (proxied to APP_SERVICE)
 *
 * Uses service bindings to communicate with app and API workers.
 */

import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import {
  COOKIE_NAMES,
  extractSession,
  setCacheHeaders,
} from "./lib/auth-helpers";
import type { BetterAuthApiResponse } from "./types/env";

interface Env {
  ASSETS: Fetcher; // Built-in for static assets
  APP_SERVICE: Fetcher; // Service binding to apps/app
  API_SERVICE: Fetcher; // Service binding to apps/api
  ENVIRONMENT: string;
}

const app = new Hono<{ Bindings: Env }>();

/**
 * API routes - proxy all /api/* requests to API service
 * PRIORITY 1: Must come before other routes to ensure API requests are handled correctly
 * Uses .all() to handle all HTTP methods (GET, POST, PUT, DELETE, etc.)
 */
app.all("/api/*", (c) => {
  return c.env.API_SERVICE.fetch(c.req.raw);
});

/**
 * App routes - proxy app-specific paths to APP service
 * PRIORITY 2: These routes always go to the main application worker
 * Uses .all() to handle all HTTP methods for SPA routing
 */
app.all("/_app/*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/login*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/signup*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/settings*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/analytics*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/reports*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));

/**
 * Home page routing logic
 * PRIORITY 3: Dynamic routing based on authentication status
 * Routes authenticated users to app, unauthenticated users to marketing site
 *
 * Supports both GET and HEAD methods for proper HTTP compliance
 * Applies cache control headers to prevent auth-state mixing
 */
app.on(["GET", "HEAD"], "/", async (c) => {
  try {
    // Support both regular and secure cookie names (HTTPS uses __Secure- prefix)
    const sessionToken =
      getCookie(c, COOKIE_NAMES.SESSION) ||
      getCookie(c, COOKIE_NAMES.SESSION_SECURE);

    if (!sessionToken) {
      // No session cookie, serve marketing site with cache headers
      return setCacheHeaders(await c.env.ASSETS.fetch(c.req.raw));
    }

    // Forward full cookie header (Better Auth may use multiple cookies)
    const cookieHeader = c.req.header("cookie") ?? "";

    // Verify session with API service
    // Hostname can be arbitrary for internal service binding calls
    const authCheckResponse = await c.env.API_SERVICE.fetch(
      new Request("https://api.internal/api/auth/get-session", {
        method: "GET",
        headers: {
          cookie: cookieHeader, // Forward all cookies, not just session token
          accept: "application/json",
        },
      }),
    );

    if (!authCheckResponse.ok) {
      // Invalid response, serve marketing site with cache headers
      return setCacheHeaders(await c.env.ASSETS.fetch(c.req.raw));
    }

    const json = (await authCheckResponse
      .json()
      .catch(() => null)) as BetterAuthApiResponse | null;

    // Handle varying Better Auth response shapes
    const session = extractSession(json);

    if (session) {
      // Valid session, proxy to app service with cache headers
      return setCacheHeaders(await c.env.APP_SERVICE.fetch(c.req.raw));
    }

    // No valid session, serve marketing site with cache headers
    return setCacheHeaders(await c.env.ASSETS.fetch(c.req.raw));
  } catch (error) {
    // On any error, default to marketing site for best UX
    console.error("Auth check failed for home page:", error);
    return setCacheHeaders(await c.env.ASSETS.fetch(c.req.raw));
  }
});

/**
 * All other routes serve static assets
 * PRIORITY 4: Wildcard must come last to catch marketing pages
 * This ensures marketing pages (about, features, pricing) work normally
 */
app.get("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
