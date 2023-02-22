/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { getMimeType } from "hono/utils/mime";
import manifestJson from "__STATIC_CONTENT_MANIFEST";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
const app = new Hono();
const manifest = JSON.parse(manifestJson);

app.get("/echo", ({ json, req }) => {
  return json({
    headers: Object.fromEntries(req.headers.entries()),
    cf: req.raw.cf,
  });
});

// Rewrite HTTP requests starting with "/api/"
// to the Star Wars API as an example
app.use("/api/*", ({ req }) => {
  const { pathname, search } = new URL(req.url);
  return fetch(`https://swapi.dev${pathname}${search}`, req);
});

// Static assets handler
// https://hono.dev/getting-started/cloudflare-workers#serve-static-files
const asset = serveStatic({ manifest });
const fallback = serveStatic({ path: "/index.html", manifest });

// Serve web application assets bundled into
// the worker script from the `../app/dist` folder
app.use("*", async (ctx, next) => {
  const url = new URL(ctx.req.url);

  const isKnownRoute = ["", "/", "/privacy", "/terms"].includes(url.pathname);

  // Serve index.html for known URL routes
  if (isKnownRoute) {
    return await fallback(ctx, next);
  }

  // Otherwise attempt to serve the static asset (file)
  const res = await asset(ctx, next);

  // Serve index.html for unknown URL routes with 404 status code
  if (res?.status === 404 && !getMimeType(url.pathname)) {
    const res = await fallback(ctx, next);

    if (res) {
      return new Response(res.body, { ...res, status: 404 });
    }
  }

  return res;
});

export default app;
