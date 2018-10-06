/* eslint-disable import/prefer-default-export */
import createUnitGql from '../gql/createUnit.gql';

import { ADD_UNIT, SET_UNIT } from '../constants';

export function createUnit(unit) {
  return {
    type: ADD_UNIT,
    data: unit,
  };
}

export function setUnit(unit) {
  return {
    type: SET_UNIT,
    data: unit,
  };
}

export function addUnit(unit) {
  return async (dispatch, getState, { graphqlRequest }) => {
    const { id } = getState().course;
    const { data } = await graphqlRequest(createUnitGql, { ...unit, id });
    dispatch(createUnit(data.createUnit));
  };
}
