/* eslint-disable import/prefer-default-export */

import { ADD_UNIT, SET_UNITS } from '../constants';

export function addUnit(id, title) {
  return {
    type: ADD_UNIT,
    data: {
      id,
      title,
    },
  };
}

export function setUnits(units) {
  return {
    type: SET_UNITS,
    data: units,
  };
}
