// @flow

import { defaults } from '../state/index';

export default function createInitialState(data: Object) {
  return {
    ...defaults,
    ...data,
  };
}
