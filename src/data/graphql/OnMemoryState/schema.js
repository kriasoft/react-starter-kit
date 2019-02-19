import merge from 'lodash.merge';

import {
  resolvers as networkStatusResolvers,
  defaults as networkStatusDefaults,
  schema as networkStatusSchema,
  queries as networkStatusQuery,
  mutations as networkStatusMutation,
} from './networkStatus';

// Below are used for apollo-link-state and not used in GraphQL server.
export const defaults = merge(networkStatusDefaults);
export const resolvers = merge(networkStatusResolvers);

// Below are used for GraphQL introspection that generates Flow types by apollo:codegen.
// These are not used in runtime.
export const schema = merge(networkStatusSchema);
export const queries = merge(networkStatusQuery);
export const mutations = merge(networkStatusMutation);
