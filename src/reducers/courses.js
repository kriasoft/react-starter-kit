import { ADD_COURSE, SET_COURSES } from '../constants';

export default function courses(state = [], action) {
  switch (action.type) {
    case SET_COURSES:
      return action.data;
    case ADD_COURSE:
      return [...state, action.data];
    default:
      return state;
  }
}
