import { SET_STUDY_ENTITY_HEADERS } from '../constants';

export function dumb() {}

export function setStudyEntityHeaders(headers) {
  return {
    type: SET_STUDY_ENTITY_HEADERS,
    data: headers,
  };
}
