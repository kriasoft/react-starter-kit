import fetch from '../core/fetch';

const getGraphQLStringMessage = queryString => `Plain GraphQL string found.
You should precompile GraphQL queries by require them from *.graphql file.
Query: ${queryString.trimLeft().substring(0, 60)}`;

function createGraphqlRequest(apolloClient) {
  return async function graphqlRequest(queryOrString, variables, options = {}) {
    const { skipCache } = options;
    let query = queryOrString;
    if (typeof queryOrString === 'string') {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.trace(getGraphQLStringMessage(queryOrString));
      }
      const gql = await require.ensure(['graphql-tag'], require => require('graphql-tag'), 'graphql-tag');
      query = gql([queryOrString]);
    }

    if (skipCache) {
      return apolloClient.networkInterface.query({ query, variables });
    }
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
