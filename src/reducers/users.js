import { SET_GROUPS, ADD_GROUP, SET_USERS } from '../constants';

const initialState = {
  users: [],
  groups: [],
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case SET_USERS:
      return { ...state, users: action.data };
    case SET_GROUPS:
      return { ...state, groups: action.data };
    case ADD_GROUP:
      return { ...state, groups: [...state.groups, action.data] };
    default:
      return state;
  }
}
