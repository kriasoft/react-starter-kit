/* eslint-disable import/prefer-default-export */

import {
  ADD_GROUP,
  SET_GROUPS,
  ADD_USER_TO_GROUP,
  SET_GROUP,
  DELETE_USER_FROM_GROUP,
} from '../constants';

export function addUserToGroup(groupId, user) {
  return {
    type: ADD_USER_TO_GROUP,
    data: {
      groupId,
      user,
    },
  };
}

export function deleteUserFromGroup(groupId, user) {
  return {
    type: DELETE_USER_FROM_GROUP,
    data: {
      groupId,
      user,
    },
  };
}

export function setGroup(group) {
  return {
    type: SET_GROUP,
    data: group,
  };
}

export function addGroup(group) {
  return {
    type: ADD_GROUP,
    data: group,
  };
}

export function setGroups(groups) {
  return {
    type: SET_GROUPS,
    data: groups,
  };
}
