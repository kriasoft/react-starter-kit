import { SET_FILES, ADD_FILE } from '../constants';

export default function files(state = {}, action) {
  switch (action.type) {
    case SET_FILES:
      return { ...state, items: action.data };
    case ADD_FILE:
      return { ...state, items: [...state.items, action.data] };
    default:
      return state;
  }
}
