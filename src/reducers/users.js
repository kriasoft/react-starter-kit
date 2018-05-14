import { SET_USERS } from '../constants';

export default function users(state = [], action) {
  switch (action.type) {
    case SET_USERS:
      return action.data;
    default:
      return state;
  }
}
