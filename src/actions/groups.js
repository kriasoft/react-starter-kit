/* eslint-disable import/prefer-default-export */

import {
  ADD_GROUP,
  SET_GROUPS,
  ADD_USER_TO_GROUP,
  SET_GROUP,
  DELETE_USER_FROM_GROUP,
  UPDATE_GROUP,
} from '../constants';

import loadGroups from '../gql/loadGroups.gql';

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

export function updateGroup({ id, title }) {
  return {
    type: UPDATE_GROUP,
    data: { id, title },
  };
}

export function fetchGroups() {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadGroups);
    return dispatch(setGroups(data.groups));
  };
}
