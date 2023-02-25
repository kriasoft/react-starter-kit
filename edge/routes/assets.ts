/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { serveStatic } from "hono/cloudflare-workers";
import { getMimeType } from "hono/utils/mime";
import assetManifest from "__STATIC_CONTENT_MANIFEST";
import { app } from "../core/app.js";

const manifest = JSON.parse(assetManifest);

// Static assets handler
// https://hono.dev/getting-started/cloudflare-workers#serve-static-files
const asset = serveStatic({ manifest });
const fallback = serveStatic({ path: "/index.html", manifest });

// Serve web application assets bundled into
// the worker script from the `../app/dist` folder
export const handler = app.use("*", async (ctx, next) => {
  const url = new URL(ctx.req.url);

  // Alternatively, import the list of routes from the `app` package
  const isKnownRoute = [
    "",
    "/",
    "/dashboard",
    "/settings",
    "/settings/account",
    "/login",
    "/signup",
    "/privacy",
    "/terms",
  ].includes(url.pathname);

  // Serve index.html for known URL routes
  if (isKnownRoute) {
    return await fallback(ctx, next);
  }

  // Otherwise attempt to serve the static asset (file)
  const res = await asset(ctx, next);

  // Serve index.html for unknown URL routes with 404 status code
  if (!res && !getMimeType(url.pathname)) {
    const res = await fallback(ctx, next);

    if (res) {
      return new Response(res.body, { ...res, status: 404 });
    }
  }

  return res;
});

export type AssetsHandler = typeof handler;
