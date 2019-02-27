import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { SchemaLink } from 'apollo-link-schema';
import merge from 'lodash.merge';
import gql from 'graphql-tag';
import createCache from './createCache';
import {
  resolvers as clientResolvers,
  schema as clientSchema,
  defaults as cacheDefaults,
} from '../../data/graphql/OnMemoryState/schema';

export default function createApolloClient(schema, partialCacheDefaults) {
  const cache = createCache();

  cache.writeData({
    data: merge(cacheDefaults, partialCacheDefaults),
  });

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
    new SchemaLink({ ...schema }),
  ]);

  return new ApolloClient({
    link,
    cache,
    typeDefs: gql(clientSchema),
    resolvers: clientResolvers,
    ssrMode: true,
    queryDeduplication: true,
  });
}
