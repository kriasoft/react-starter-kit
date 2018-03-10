import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import courses from './courses';
import course from './course';
import studyEntity from './studyEntity';

export default combineReducers({
  user,
  runtime,
  courses,
  course,
  studyEntity,
});
