import { SET_UNIT_HEADERS } from '../constants';

export function dumb() {}

export function setUnitHeaders(headers) {
  return {
    type: SET_UNIT_HEADERS,
    data: headers,
  };
}
