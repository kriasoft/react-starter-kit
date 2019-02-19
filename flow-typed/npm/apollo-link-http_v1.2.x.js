// flow-typed signature: 4ab386f3c584d85b158908552aadde04
// flow-typed version: 9b6155aff6/apollo-link-http_v1.2.x/flow_>=v0.56.x

// @flow

declare module 'apollo-link-http' {
  declare type $Record<T, U> = { [key: $Enum<T>]: U };

  declare type NextLink = (operation: Operation) => any;

  declare export type RequestHandler = (
    operation: Operation,
    forward?: NextLink,
  ) => any;

  declare export class ApolloLink {
    constructor(request?: RequestHandler): void;

    static empty: ApolloLink;
    static from(links: ApolloLink[]): ApolloLink;
    static execute(link: ApolloLink, operation: GraphQLRequest): any;

    split(
      test: (op: Operation) => boolean,
      left: ApolloLink | RequestHandler,
      right: ApolloLink | RequestHandler,
    ): ApolloLink;

    concat(next: ApolloLink | RequestHandler): ApolloLink;

    request(operation: Operation, forward?: NextLink): any;
  }

  declare export interface GraphQLRequest {
    query: any;
    variables?: $Record<string, any>;
    operationName?: string;
    context?: $Record<string, any>;
    extensions?: $Record<string, any>;
  }

  declare export interface Operation {
    query: any;
    variables: $Record<string, any>;
    operationName: string;
    extensions: $Record<string, any>;
    setContext: (context: $Record<string, any>) => $Record<string, any>;
    getContext: () => $Record<string, any>;
    toKey: () => string;
  }

  declare export interface UriFunction {
    (operation: Operation): string;
  }

  declare export type FetchOptions = {
    uri?: string | UriFunction,
    fetch?: any,
    includeExtensions?: boolean,
    credentials?: string,
    headers?: any,
    fetchOptions?: any,
  };

  declare export function createHttpLink(opts: FetchOptions): ApolloLink;

  declare export class HttpLink {
    requester: RequestHandler;
    constructor(opts: FetchOptions): HttpLink;
  }
}
