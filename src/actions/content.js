/* eslint-disable import/prefer-default-export */

import {
  FETCH_CONTENT_START,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
} from '../constants';

const query = `
  query($path:String!,$locale:String!) {
    content(path:$path,locale:$locale) {
      title, content,
    }
  }
`;

export function getContent({ path, locale }) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch({
      type: FETCH_CONTENT_START,
      payload: {
        path,
        locale,
      },
    });

    try {
      const { data } = await graphqlRequest(query, { path, locale });
      dispatch({
        type: FETCH_CONTENT_SUCCESS,
        payload: {
          ...data.content,
          path,
          locale,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_CONTENT_ERROR,
        payload: {
          error,
          path,
          locale,
        },
      });
      return false;
    }

    return true;
  };
}
