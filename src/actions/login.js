import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../constants';


import mutateLogin from './login.graphql';


export default function login({ usernameOrEmail, password }) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch({
      type: LOGIN_START,
    });

    try {
      const { data } = await graphqlRequest(mutateLogin,
        { usernameOrEmail, password }, { skipCache: true });
      const user = data.user;
      console.log(data, user);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: user,
      });
      // TODO save token
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }
    return true;
  };
}
