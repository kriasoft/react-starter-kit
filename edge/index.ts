/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import {
  getAssetFromKV,
  serveSinglePageApp,
} from "@cloudflare/kv-asset-handler";
import manifest from "__STATIC_CONTENT_MANIFEST";

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);

    if (url.pathname === "/echo") {
      return Response.json({
        headers: Object.fromEntries(req.headers.entries()),
        cf: req.cf,
      });
    }

    // Serve web application assets bundled into
    // the worker script from the `dist/app` folder
    return await getAssetFromKV(
      {
        request: req,
        waitUntil(promise) {
          return ctx.waitUntil(promise);
        },
      },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(manifest),
        mapRequestToAsset: serveSinglePageApp,
      }
    );
  },
} as Required<Pick<ExportedHandler<Env>, "fetch">>;
