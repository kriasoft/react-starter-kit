/* eslint-disable import/prefer-default-export */

import { ADD_GROUP, SET_GROUPS, SET_USERS } from '../constants';

export function addGroup({ id, title }) {
  return {
    type: ADD_GROUP,
    data: {
      id,
      title,
    },
  };
}

export function setGroups(groups) {
  return {
    type: SET_GROUPS,
    data: groups,
  };
}

export function setUsers(users) {
  return {
    type: SET_USERS,
    data: users,
  };
}
