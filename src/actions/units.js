/* eslint-disable import/prefer-default-export */

import { ADD_UNIT } from '../constants';

export function createUnit(unit) {
  return {
    type: ADD_UNIT,
    data: unit,
  };
}
