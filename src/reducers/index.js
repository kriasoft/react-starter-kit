import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import courses from './courses';
import course from './course';
import studyEntity from './study-entity';
import users from './users';
import files from './files';
import groups from './groups';

export default combineReducers({
  user,
  runtime,
  courses,
  course,
  studyEntity,
  users,
  files,
  groups,
});
