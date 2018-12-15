import {
  ADD_USER_TO_GROUP,
  SET_GROUP,
  DELETE_USER_FROM_GROUP,
  UPDATE_GROUP,
} from '../constants';

export default function group(state = {}, action) {
  switch (action.type) {
    case SET_GROUP:
      return { ...action.data };

    case UPDATE_GROUP:
      return state.id === action.data.id ? { ...action.data } : state;

    case ADD_USER_TO_GROUP: {
      if (state.id !== action.data.groupId) return state;
      return { ...state, users: [...state.users, action.data.user] };
    }

    case DELETE_USER_FROM_GROUP: {
      if (state.id !== action.data.groupId) return state;
      return {
        ...state,
        users: state.users.filter(u => u.id !== action.data.user.id),
      };
    }

    default:
      return state;
  }
}
