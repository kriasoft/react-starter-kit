/* eslint-disable import/prefer-default-export */

import { SET_SECOND_MENU } from '../constants';

export default function secondMenu(state = {}, action) {
  switch (action.type) {
    case SET_SECOND_MENU:
      return { ...state, [action.data.type]: action.data.items };
    default:
      return state;
  }
}
