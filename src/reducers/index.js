import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import courses from './courses';
import course from './course';

export default combineReducers({
  user,
  runtime,
  courses,
  course,
});
