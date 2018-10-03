import {
  ADD_UNIT,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  SET_COURSE,
  UPDATE_COURSE,
} from '../constants';

export default function course(state = {}, action) {
  switch (action.type) {
    case SET_COURSE:
      return action.data;
    case ADD_UNIT:
      return { ...state, units: [...state.units, action.data] };
    case UPDATE_COURSE:
      return { ...state, title: action.data.title };
    case SUBSCRIBE_USER:
      return {
        ...state,
        users: [...state.users, action.data],
      };
    case UNSUBSCRIBE_USER:
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.data.id),
      };
    default:
      return state;
  }
}
