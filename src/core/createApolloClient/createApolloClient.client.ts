import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import gql from 'graphql-tag';
import createCache from './createCache';
import {
  resolvers as clientResolvers,
  schema as clientSchema,
} from '../../data/graphql/OnMemoryState/schema';

export default function createApolloClient() {
  // Restore cache defaults to make the same one in server.js
  const cache = createCache().restore(window.App.cache);

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
    ...(__DEV__ ? [apolloLogger] : []),
    new HttpLink({
      uri: '/graphql',
      credentials: 'include',
    }),
  ]);

  return new ApolloClient({
    // @ts-ignore
    link,
    cache,
    typeDefs: gql(clientSchema),
    resolvers: clientResolvers,
    queryDeduplication: true,
    connectToDevTools: true,
  });
}
