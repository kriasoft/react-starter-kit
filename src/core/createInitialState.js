// @flow

import { defaults } from '../data/graphql/OnMemoryState/schema';

export default function createInitialState(data: Object) {
  return {
    ...defaults,
    ...data,
  };
}
