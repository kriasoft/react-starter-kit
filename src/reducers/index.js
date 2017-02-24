import { combineReducers } from 'redux';
import user from './user';
import runtime from './runtime';

export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    apollo: apolloClient.reducer(),
    user,
    runtime,
  });
}
