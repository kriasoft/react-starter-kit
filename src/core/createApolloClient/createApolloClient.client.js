import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import { withClientState } from 'apollo-link-state';
import createCache from './createCache';
import { resolvers as clientSideResolvers } from '../../data/graphql/OnMemoryState/schema';

export default function createApolloClient() {
  const cache = createCache();

  const stateLink = withClientState({
    cache,
    defaults: window.App.initialState,
    resolvers: clientSideResolvers,
  });

  const link = from([
    stateLink,
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.warn(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      if (networkError) console.warn(`[Network error]: ${networkError}`);
    }),
    ...(__DEV__ ? [apolloLogger] : []),
    new HttpLink({
      uri: '/graphql',
      credentials: 'include',
    }),
  ]);

  return new ApolloClient({
    link,
    cache: cache.restore(window.App.cache),
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
