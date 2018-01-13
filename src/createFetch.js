/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */
import { graphql } from 'graphql';

type Fetch = (url: string, options: ?any) => Promise<any>;

type Options = {
  baseUrl: string,
  cookie?: string,
};

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch: Fetch, { baseUrl, cookie, schema }: Options) {
  // NOTE: Tweak the default options to suite your application needs
  const defaults = {
    method: 'POST', // handy with GraphQL backends
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return (url: string, options: any) => {
    const isGraphQL = url.startsWith('/graphql');
    if (schema && isGraphQL) {
      // We're SSR, so route the graphql internall to avoid latency
      const query = JSON.parse(options.body);
      const result = await graphql(
        schema,
        query.query,
        { request: {} }, // fill in request vars needed by graphql
        null,
        query.variables,
      );
      return new Promise(resolve => resolve({
        status: result.errors ? 500 : 200,
        json: () =>
          new Promise((resolveJson) => resolveJson(result)),
      }));
    }
    return isGraphQL || url.startsWith('/api')
      ? fetch(`${baseUrl}${url}`, {
        ...defaults,
        ...options,
        headers: {
          ...defaults.headers,
          ...(options && options.headers),
        },
      })
      : fetch(url, options);
  }
}

export default createFetch;
