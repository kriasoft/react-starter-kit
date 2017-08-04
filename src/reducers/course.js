import { ADD_STUDY_ENTITY, SET_STUDY_ENTITIES } from '../constants';

export default function studyEntities(state = {}, action) {
  const newState = state;
  switch (action.type) {
    case ADD_STUDY_ENTITY:
      newState.studyEntities = state.studyEntities || [];
      newState.studyEntities.push(action.data);
      return newState;
    case SET_STUDY_ENTITIES:
      newState.studyEntities = action.data;
      return newState;
    default:
      return state;
  }
}
