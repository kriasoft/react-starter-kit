import merge from 'lodash.merge';

import {
  resolvers as networkStatusResolvers,
  defaults as networkStatusDefaults,
  schema as networkStatusSchema,
  queries as networkStatusQuery,
  mutations as networkStatusMutation,
} from './networkStatus';

import { schema as userSchema, queries as userQueries } from './user';

// Used by both GraphQL Server and Apollo Client
export const schema = [...userSchema, ...networkStatusSchema];

// Below are only used by Apollo Client
export const defaults = merge(networkStatusDefaults);
export const resolvers = merge(networkStatusResolvers);

// Below are used by GraphQL Server for Introspection
// that generates Flow types by apollo:codegen.
export const queries = [...networkStatusQuery, ...userQueries];
export const mutations = [...networkStatusMutation];
