/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* @flow */

import fetch from 'isomorphic-fetch';
import {
  Environment,
  Network,
  RecordSource,
  Store,
  fetchQuery,
  commitMutation,
  commitLocalUpdate,
} from 'relay-runtime';

type Options = {
  baseUrl: string,
  headers?: { [string]: string },
};

/**
 * Creates a set of helper methods for working with REST and/or GraphQL APIs.
 */
function create({ baseUrl, headers = {} }: Options) {
  // Default options for the Fetch API
  // https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
  const defaults = {
    mode: baseUrl ? 'cors' : 'same-origin',
    credentials: baseUrl ? 'include' : 'same-origin',
    headers: {
      ...headers,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  // Configure Relay environment
  const environment = new Environment({
    handlerProvider: null,
    network: Network.create((operation, variables /* cacheConfig, uploadables */) => fetch(`${baseUrl}/graphql`, {
      ...defaults,
      method: 'POST',
      body: JSON.stringify({
        query: operation.text, // GraphQL text from input
        variables,
      }),
    }).then(x => x.json())),
    store: new Store(new RecordSource()),
  });

  // Helper methods for working with REST or GraphQL API
  return {
    environment,
    fetch: (url: string, options: any) => fetch(`${baseUrl}${url}`, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...(options && options.headers),
      },
    }),
    fetchQuery: fetchQuery.bind(undefined, environment),
    commitMutation: commitMutation.bind(undefined, environment),
    commitLocalUpdate: commitLocalUpdate.bind(undefined, environment),
  };
}

export default { create };
