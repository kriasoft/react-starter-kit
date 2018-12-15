import { combineReducers } from 'redux';
import answer from './answer';
import course from './course';
import courses from './courses';
import files from './files';
import group from './group';
import groups from './groups';
import modals from './modals';
import secondMenu from './menu';
import unit from './unit';
import user from './user';
import users from './users';

export default combineReducers({
  answer,
  course,
  courses,
  files,
  group,
  groups,
  modals,
  secondMenu,
  unit,
  user,
  users,
});
