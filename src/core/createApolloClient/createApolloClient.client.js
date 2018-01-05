import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';

const link = from([
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    if (networkError) console.warn(`[Network error]: ${networkError}`);
  }),
  new HttpLink({
    uri: '/graphql',
    credentials: 'include',
  }),
]);

const cache = new InMemoryCache();

export default function createApolloClient() {
  return new ApolloClient({
    link,
    cache: cache.restore(window.__APOLLO_CLIENT__), // eslint-disable-line no-underscore-dangle
    ssrMode: true,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
