import { SET_GROUPS, ADD_GROUP, SET_USERS } from '../constants';

export default function users(state = [], action) {
  switch (action.type) {
    case SET_USERS:
      return action.data;
    case SET_GROUPS:
      return { ...state, groups: action.data };
    case ADD_GROUP:
      return { ...state, groups: [...state.groups, action.data] };
    default:
      return state;
  }
}
