/* eslint-disable import/prefer-default-export */

import { ADD_UNIT, SET_UNIT } from '../constants';

export function createUnit(unit) {
  return {
    type: ADD_UNIT,
    data: unit,
  };
}

export function setUnit(unit) {
  return {
    type: SET_UNIT,
    data: unit,
  };
}
