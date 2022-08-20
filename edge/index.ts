/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  getAssetFromKV,
  serveSinglePageApp,
} from "@cloudflare/kv-asset-handler";
import { Hono } from "hono";
import manifest from "__STATIC_CONTENT_MANIFEST";

/**
 * Application router for Cloudflare Workers
 * @see https://honojs.dev/
 */
const app = new Hono();

app.get("/echo", (ctx) => {
  return ctx.json({
    headers: Object.fromEntries(ctx.req.headers.entries()),
    cf: ctx.req.cf,
  });
});

// Serve web application assets bundled into
// the worker script from the `dist/app` folder
// https://github.com/cloudflare/kv-asset-handler#readme
app.get("*", async ({ req, executionCtx, env }) => {
  return await getAssetFromKV(
    {
      request: req,
      waitUntil(promise) {
        return executionCtx.waitUntil(promise);
      },
    },
    {
      ASSET_NAMESPACE: env.__STATIC_CONTENT,
      ASSET_MANIFEST: JSON.parse(manifest),
      mapRequestToAsset: serveSinglePageApp,
    }
  );
});

export default app;
