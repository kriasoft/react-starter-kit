import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl from './intl';
import content from './content';

export default combineReducers({
  user,
  runtime,
  intl,
  content,
});
