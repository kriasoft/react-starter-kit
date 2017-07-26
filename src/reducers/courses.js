import { ADD_COURSE, SET_COURSES } from '../constants';

export default function courses(state = {}, action) {
  const newState = state;
  switch (action.type) {
    case ADD_COURSE:
      newState.courses = state.courses || [];
      newState.courses.push(action.data);
      return newState;
    case SET_COURSES:
      newState.courses = action.data;
      return newState;
    default:
      return state;
  }
}
