import { SET_UNIT_HEADERS, ADD_MARK, SET_ANSWER } from '../constants';
import createMarkGql from '../gql/createMark.gql';
import loadAnswerGql from '../gql/loadAnswer.gql';

export function dumb() {}

export function setUnitHeaders(headers) {
  return {
    type: SET_UNIT_HEADERS,
    data: headers,
  };
}

export function addMark(mark) {
  return {
    type: ADD_MARK,
    data: mark,
  };
}

export function setAnswer(answer) {
  return {
    type: SET_ANSWER,
    data: answer,
  };
}

export function createMark(mark) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(createMarkGql, mark);
    dispatch(addMark(data.createMark));
  };
}

export function loadAnswer(id) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadAnswerGql, { id });
    dispatch(setAnswer(data.answers[0]));
  };
}
