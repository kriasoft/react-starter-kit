import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';
import intl from './intl';

export default function createRootReducer() {
  return combineReducers({
    user,
    runtime,
    intl,
  });
}
