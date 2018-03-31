import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import courses from './courses';
import course from './course';
import studyEntity from './studyEntity';
import users from './users';
import files from './files';

export default combineReducers({
  user,
  runtime,
  courses,
  course,
  studyEntity,
  users,
  files,
});
