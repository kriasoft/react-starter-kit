/* eslint-disable import/prefer-default-export */
import createUnitGql from '../gql/createUnit.gql';
import updateUnitGql from '../gql/updateUnit.gql';

import { ADD_UNIT, SET_UNIT, UPDATE_UNIT } from '../constants';

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

export function editUnit(unit) {
  return {
    type: UPDATE_UNIT,
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

export function updateUnit(unit) {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(updateUnitGql, unit);
    dispatch(editUnit(data.updateUnit));
  };
}
