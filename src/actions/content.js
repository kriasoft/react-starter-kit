/* eslint-disable import/prefer-default-export */

import {
  GET_LOCALE_CONTENT,
  GET_LOCALE_CONTENT_SUCCESS,
  GET_LOCALE_CONTENT_ERROR,
} from '../constants';

const query = `
  query($path:String!,$locale:String!) {
    content(path:$path,locale:$locale) {
      title, content,
    }
  }
`;

export function getLocaleContent(path, locale) {
  return async (dispatch, getState, { graphqlRequest }) => {
    dispatch({
      type: GET_LOCALE_CONTENT,
    });

    try {
      const { data } = await graphqlRequest(query, { path, locale });
      dispatch({
        type: GET_LOCALE_CONTENT_SUCCESS,
        payload: {
          data: data.content,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_LOCALE_CONTENT_ERROR,
        payload: {
          error,
        },
      });
      return false;
    }

    return true;
  };
}
