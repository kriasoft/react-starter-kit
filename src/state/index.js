import merge from 'lodash.merge';

import {
  resolvers as NetworkStateResolvers,
  defaults as NetworkStateDefaults,
} from './OnMemory/networkState';

export const defaults = merge(NetworkStateDefaults);

export const resolvers = merge(NetworkStateResolvers);
