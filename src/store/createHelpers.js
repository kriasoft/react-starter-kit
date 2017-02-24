import gql from 'graphql-tag';
import fetch from '../core/fetch';

function createGraphqlRequest(apolloClient) {
  return function graphqlRequest(queryOrString, variables) {
    const query =
      typeof queryOrString === 'string' ? gql`${queryOrString}` : queryOrString;
    return apolloClient.query({ query, variables });
  };
}

function createFetchKnowingCookie({ cookie }) {
  if (!process.env.BROWSER) {
    return (url, options = {}) => {
      const isLocalUrl = /^\/($|[^/])/.test(url);

      // pass cookie only for itself.
      // We can't know cookies for other sites BTW
      if (isLocalUrl && options.credentials === 'include') {
        const headers = {
          ...options.headers,
          cookie,
        };
        return fetch(url, { ...options, headers });
      }

      return fetch(url, options);
    };
  }

  return fetch;
}

export default function createHelpers(config) {
  const fetchKnowingCookie = createFetchKnowingCookie(config);
  const graphqlRequest = createGraphqlRequest(config.apolloClient);

  return {
    apolloClient: config.apolloClient,
    history: config.history,
    fetch: fetchKnowingCookie,
    graphqlRequest,
  };
}
