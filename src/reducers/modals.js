import { SHOW_MODAL, HIDE_MODAL } from '../constants';

export default function modals(state = {}, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return { ...state, [action.data]: true };
    case HIDE_MODAL:
      return { ...state, [action.data]: false };
    default:
      return state;
  }
}
