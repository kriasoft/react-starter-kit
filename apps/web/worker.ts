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

/**
 * Paths forwarded to the app worker.
 *
 * Keep route entries in sync with the app-owned top-level routes under
 * `apps/app/routes/`. Missing entries fall through to the marketing site on a
 * direct request, even though client-side navigation still works.
 *
 * `/` is handled below using the auth hint. Everything under `apps/web/pages/`
 * is marketing-owned and must not appear here. `apps/app/lib/edge-routing.test.ts`
 * checks both directions.
 */
const APP_PATHS = [
  "_app", // Vite build output (JS, CSS, assets)
  "login",
  "members",
  "settings",
  "signup",
] as const;

const app = new Hono<{ Bindings: Env }>();

// API proxy
app.all("/api/*", (c) => c.env.API_SERVICE.fetch(c.req.raw));

// Match each exact path and its slash-delimited children. A bare `/${path}*`
// also matches shared prefixes such as `/members-only`; the app worker's SPA
// fallback would then shadow a marketing page at that path.
for (const path of APP_PATHS) {
  app.all(`/${path}`, (c) => c.env.APP_SERVICE.fetch(c.req.raw));
  app.all(`/${path}/*`, (c) => c.env.APP_SERVICE.fetch(c.req.raw));
}

// Home page: route based on auth-hint cookie presence
// __Host-auth (HTTPS) or auth (HTTP dev) – see docs/adr/001-auth-hint-cookie.md
app.on(["GET", "HEAD"], "/", async (c) => {
  const hasAuthHint =
    getCookie(c, "__Host-auth") === "1" || getCookie(c, "auth") === "1";

  const upstream = await (hasAuthHint ? c.env.APP_SERVICE : c.env.ASSETS).fetch(
    c.req.raw,
  );

  // Prevent caching – response varies by auth state
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
