import { SHOW_MODAL, HIDE_MODAL } from '../constants';

export default function modals(state = {}, action) {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        [action.data.id]: true,
        [`${action.data.id}_data`]: action.data.data,
      };
    case HIDE_MODAL:
      return { ...state, [action.data]: false };
    default:
      return state;
  }
}
