import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import courses from './courses';

export default combineReducers({
  user,
  runtime,
  courses,
});
