/* eslint-disable import/prefer-default-export */

import { ADD_STUDY_ENTITY, SET_STUDY_ENTITIES } from '../constants';

export function addStudyEntity({ id, title }) {
  return {
    type: ADD_STUDY_ENTITY,
    data: {
      id,
      title,
    },
  };
}

export function setStudyEntities(studyEntities) {
  return {
    type: SET_STUDY_ENTITIES,
    data: studyEntities,
  };
}
