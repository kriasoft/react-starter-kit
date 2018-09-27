import { SET_UNIT_HEADERS } from '../constants';

export default function unit(state = {}, action) {
  const nextState = { ...state };
  switch (action.type) {
    case SET_UNIT_HEADERS:
      nextState.headers = action.data;
      return nextState;
    default:
      return state;
  }
}
