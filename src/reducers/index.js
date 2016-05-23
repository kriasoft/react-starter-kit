import { combineReducers } from 'redux';
import runtime from './runtime';
import intl from './intl';

export default combineReducers({
  runtime,
  intl,
});
