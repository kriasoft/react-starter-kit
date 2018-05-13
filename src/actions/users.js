/* eslint-disable import/prefer-default-export */

import { SET_USERS } from '../constants';

export function setUsers(users) {
  return {
    type: SET_USERS,
    data: users,
  };
}
