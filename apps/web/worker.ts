/**
 * Edge router for the marketing site.
 *
 * Routes "/" based on auth-hint cookie presence:
 * - Cookie present: proxy to app (session validated there)
 * - No cookie: serve marketing site
 *
 * See docs/adr/001-auth-hint-cookie.md
 */

import { Hono } from "hono";
import { getCookie } from "hono/cookie";

interface Env {
  ASSETS: Fetcher;
  APP_SERVICE: Fetcher;
  API_SERVICE: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

// API proxy
app.all("/api/*", (c) => c.env.API_SERVICE.fetch(c.req.raw));

// App routes
app.all("/_app/*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/login*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/signup*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/settings*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/analytics*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));
app.all("/reports*", (c) => c.env.APP_SERVICE.fetch(c.req.raw));

// Home page: route based on auth-hint cookie presence
// __Host-auth (HTTPS) or auth (HTTP dev) — see docs/adr/001-auth-hint-cookie.md
app.on(["GET", "HEAD"], "/", async (c) => {
  const hasAuthHint =
    getCookie(c, "__Host-auth") === "1" || getCookie(c, "auth") === "1";

  const upstream = await (hasAuthHint ? c.env.APP_SERVICE : c.env.ASSETS).fetch(
    c.req.raw,
  );

  // Prevent caching — response varies by auth state
  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set("Vary", "Cookie");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
});

// Marketing pages
app.all("*", (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
