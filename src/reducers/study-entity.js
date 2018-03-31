import { SET_STUDY_ENTITY_HEADERS } from '../constants';

export default function studyEntity(state = {}, action) {
  const nextState = { ...state };
  switch (action.type) {
    case SET_STUDY_ENTITY_HEADERS:
      nextState.headers = action.data;
      return nextState;
    default:
      return state;
  }
}
