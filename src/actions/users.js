/* eslint-disable import/prefer-default-export */

import { SET_USERS } from '../constants';
import loadUsers from '../gql/loadUsers.gql';

export function setUsers(users) {
  return {
    type: SET_USERS,
    data: users,
  };
}

export function fetchUsers() {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadUsers);
    return dispatch(setUsers(data.users));
  };
}
