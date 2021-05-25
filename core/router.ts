/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { Match, MatchFunction } from "path-to-regexp";
import { match as createMatchFn } from "path-to-regexp";
import { fetchQuery } from "react-relay";
import routes from "../routes";
import { NotFoundError } from "./errors";
import type { Route, RouterContext, RouterResponse } from "./router.types";

/**
 * Converts the URL path string to a RegExp matching function.
 *
 * @see https://github.com/pillarjs/path-to-regexp
 */
const matchUrlPath: (
  pattern: string[] | string,
  path: string
) => Match<{ [key: string]: string }> = (() => {
  const cache = new Map<string, MatchFunction<{ [key: string]: string }>>();
  return function matchUrlPath(pattern: string[] | string, path: string) {
    const key = Array.isArray(pattern) ? pattern.join("::") : pattern;
    let fn = cache.get(key);
    if (fn) return fn(path);
    fn = createMatchFn(pattern, { decode: decodeURIComponent });
    cache.set(key, fn);
    return fn(path);
  };
})();

export async function resolveRoute(
  ctx: RouterContext
): Promise<RouterResponse> {
  try {
    // Find the first route matching the provided URL path string
    for (let i = 0, route; i < routes.length, (route = routes[i]); i++) {
      const match = matchUrlPath(route.path, ctx.path);

      if (!match) continue;

      ctx.params = match.params;

      // Prepare GraphQL query variables
      const variables =
        typeof route.variables === "function"
          ? route.variables(ctx)
          : route.variables
          ? route.variables
          : Object.keys(match.params).length === 0
          ? undefined
          : match.params;

      // Fetch GraphQL query response and load React component in parallel
      const [component, data] = await Promise.all([
        route.component?.().then((x) => x.default),
        route.query &&
          fetchQuery(ctx.relay, route.query, variables, {
            fetchPolicy: "store-or-network",
          }).toPromise(),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = route.response(data as any, ctx);

      if (response) return { component, ...response };
    }

    throw new NotFoundError();
  } catch (error) {
    return {
      title:
        error instanceof NotFoundError ? "Page not found" : "Application error",
      error,
    };
  }
}

export type { RouterContext, RouterResponse as RouteResponse, Route };
