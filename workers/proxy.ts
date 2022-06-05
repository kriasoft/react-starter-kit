/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import { createRelay } from "../core/relay";
import { resolveRoute } from "../core/router";
import { transform } from "./transform";

/**
 * Cloudflare Worker script acting as a reverse proxy
 * https://developers.cloudflare.com/workers/
 */
async function handleEvent(event: FetchEvent) {
  const req = event.request;
  const url = new URL(req.url);
  const { pathname: path, search } = url;

  // GraphQL API and authentication
  if (
    path === "/api" ||
    path.startsWith("/api/") ||
    path.startsWith("/auth/")
  ) {
    return fetch(`${API_ORIGIN}${path}${search}`, req);
  }

  // Serve static assets from KV storage
  // https://github.com/cloudflare/kv-asset-handler
  if (
    path.startsWith("/static/") ||
    path.match(/\.(ico|json|png|jpg|jpeg|gif|text)$/)
  ) {
    return getAssetFromKV(event);
  }

  // Fetch index.html page from KV storage
  const resPromise = getAssetFromKV(event, {
    mapRequestToAsset(req) {
      return new Request(new URL("/index.html", url), req);
    },
  });

  // Find application route matching the URL pathname
  const relay = createRelay({ baseUrl: API_ORIGIN, request: req });
  const route = await resolveRoute({ path, query: url.searchParams, relay });

  // Handle redirects
  if (route.redirect) {
    return Response.redirect(new URL(route.redirect, url), route.status ?? 302);
  }

  // In case of an error, save it to Relay store as a way to pass to the client
  if (route.error) {
    relay.commitUpdate(function (store) {
      const root = store.getRoot();
      root.setValue(route.error?.stack, "error");
    });
  }

  // Inject page metadata such as <title>, <meta name="description" contents="..." />, etc.
  // and serialized API response <script id="data" type="application/json">...</script>
  // https://developer.mozilla.org/docs/Web/HTML/Element/script#embedding_data_in_html
  const res = transform(await resPromise, route, relay);
  return new Response(res.body, {
    status: (route.error as unknown as { status: number })?.status || 200,
    headers: res.headers,
  });
}

addEventListener("fetch", function (event: FetchEvent) {
  event.respondWith(handleEvent(event));
});
