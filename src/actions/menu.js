/* eslint-disable import/prefer-default-export */

import { SET_SECOND_MENU } from '../constants';

export function setSecondMenu(type, items) {
  return {
    type: SET_SECOND_MENU,
    data: { type, items },
  };
}
