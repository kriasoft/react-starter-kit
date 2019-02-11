// @flow

import { defaults } from '../data/graphql/OnMemoryStatus/schema';

export default function createInitialState(data: Object) {
  return {
    ...defaults,
    ...data,
  };
}
