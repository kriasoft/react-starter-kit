/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { Match, MatchFunction } from "path-to-regexp";
import { match as createMatchFn } from "path-to-regexp";
import type { ComponentClass, ComponentProps, FunctionComponent } from "react";
import type { Environment, GraphQLTaggedNode, Variables } from "react-relay";
import { fetchQuery } from "react-relay";
import routes from "../routes";
import { NotFoundError } from "./errors";

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

async function resolveRoute(ctx: RouterContext): Promise<RouterResponse> {
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
          ? {}
          : match.params;

      // Fetch GraphQL query response and load React component in parallel
      const [component, data] = await Promise.all([
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        route.component?.().then((x: any) => x.default),
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
  } catch (err) {
    return {
      title:
        err instanceof NotFoundError ? "Page not found" : "Application error",
      error: err as Error,
    };
  }
}

/* -------------------------------------------------------------------------- */
/* TypeScript definitions                                                     */
/* -------------------------------------------------------------------------- */

type Props = any; /* eslint-disable-line @typescript-eslint/no-explicit-any */

type RouterContext = {
  path: string;
  query: URLSearchParams;
  params?: Record<string, string>;
  relay: Environment;
};

type RouterResponse<
  Component extends
    | FunctionComponent<Props>
    | ComponentClass<Props> = FunctionComponent<Props>
> = {
  title?: string;
  description?: string;
  component?: Component;
  props?: ComponentProps<Component>;
  error?: Error;
  redirect?: string;
  status?: number;
};

type Route<
  Component extends FunctionComponent<Props> | ComponentClass<Props>,
  Query extends { variables: Variables; response: unknown } = {
    variables: Variables;
    response: Record<string, unknown>;
  }
> = {
  /**
   * URL path pattern.
   */
  path: string[] | string;
  /**
   * GraphQL query expression.
   */
  query?: GraphQLTaggedNode;
  /**
   * GraphQL query variables.
   */
  variables?: ((ctx: RouterContext) => Query["variables"]) | Query["variables"];
  /**
   * Authorization rule(s) / permissions.
   */
  authorize?: ((ctx: RouterContext) => boolean) | boolean;
  /**
   * React component (loader).
   */
  component?: () => Promise<{ default: Component }>;
  /**
   * React component props and metadata that needs to be rendered
   * once the route was successfully resolved.
   */
  response: (
    queryResponse: Query["response"],
    context: RouterContext
  ) => RouterResponse<Component>;
};

export { resolveRoute, type RouterContext, type RouterResponse, type Route };
