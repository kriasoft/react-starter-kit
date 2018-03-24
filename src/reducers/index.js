import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl from './intl';

export default combineReducers({
  user,
  runtime,
  intl,
});
