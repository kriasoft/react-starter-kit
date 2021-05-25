/* SPDX-FileCopyrightText: 2014-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import type { ComponentClass, ComponentProps, FunctionComponent } from "react";
import type { Environment, GraphQLTaggedNode } from "react-relay";

/* eslint-disable @typescript-eslint/no-explicit-any */

export type RouterContext = {
  path: string;
  relay: Environment;
  params?: Record<string, string>;
};

export type RouterResponse<
  Component extends
    | FunctionComponent<any>
    | ComponentClass<any> = FunctionComponent<any>
> = {
  title?: string;
  description?: string;
  component?: Component;
  props?: ComponentProps<Component>;
  error?: Error;
  redirect?: string;
  status?: number;
};

export type Route<
  Component extends FunctionComponent<any> | ComponentClass<any>,
  QueryResponse = unknown
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
  variables?: ((ctx: RouterContext) => any) | any;
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
    queryResponse: QueryResponse,
    context: RouterContext
  ) => RouterResponse<Component>;
};
