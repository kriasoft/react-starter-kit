/* eslint-disable import/prefer-default-export */

import { ADD_GROUP, SET_GROUPS } from '../constants';

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
