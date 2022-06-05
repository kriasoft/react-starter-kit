/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

/**
 * Cloudflare Worker script acting as a reverse proxy.
 *
 * @see https://developers.cloudflare.com/workers/
 */

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import * as configs from "../config";
import { createRelay } from "../core/relay";
import { resolveRoute } from "../core/router";
import { transform } from "./transform";

async function handleEvent(event: FetchEvent) {
  const request = event.request;
  const url = new URL(event.request.url);
  const { pathname: path } = url;

  const config =
    configs.prod.app.origin === url.origin ? configs.prod : configs.test;
  const apiUrl = new URL(`${config.api.origin}${config.api.prefix || ""}`);

  // Serve static assets from KV storage
  // https://github.com/cloudflare/kv-asset-handler
  if (
    path.startsWith("/static/") ||
    path.startsWith("/favicon.") ||
    path.startsWith("/logo") ||
    path.startsWith("/manifest.") ||
    path.startsWith("/robots.")
  ) {
    try {
      return getAssetFromKV(event, {
        cacheControl: { bypassCache: config.app.env !== "prod" },
      });
    } catch (err) {
      console.error(err);
    }
  }

  // GraphQL API and authentication
  if (
    path === "/api" ||
    path.startsWith("/api/") ||
    path.startsWith("/auth/")
  ) {
    url.hostname = apiUrl.hostname;
    url.pathname = `${apiUrl.pathname}${path}`;
    return fetch(new Request(url.toString(), request));
  }

  // Image resizing
  if (path.startsWith("/img/")) {
    url.hostname = apiUrl.hostname;
    url.pathname = `/img${path.substring(4)}`;
    return fetch(new Request(url.toString(), request));
  }

  // Fetch index.html page from KV storage
  url.pathname = "/index.html";
  const resPromise = getAssetFromKV(
    {
      request: new Request(url.toString(), request),
      waitUntil: event.waitUntil,
    },
    { cacheControl: { bypassCache: config.app.env !== "prod" } }
  );

  // Find application route matching the URL pathname
  const apiBaseUrl = `${apiUrl.origin}${apiUrl.pathname}`;
  const relay = createRelay({ baseUrl: apiBaseUrl, request });
  const route = await resolveRoute({ path, relay });

  if (route.redirect) {
    return Response.redirect(route.redirect, route.status);
  }

  if (route.error) {
    relay.commitUpdate(function (store) {
      const root = store.getRoot();
      root.setValue(route.error?.stack, "error");
    });
  }

  // Inject page metadata such as <title>, <meta name="description" contents="..." />, etc.
  // and serialized API response <script id="data" type="application/json">...</script>
  // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
  const res = transform(await resPromise, route, relay, config.app.env);
  return new Response(res.body, {
    status: (route.error as unknown as { status: number })?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", function (event: FetchEvent) {
  event.respondWith(handleEvent(event));
});
