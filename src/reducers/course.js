import {
  ADD_STUDY_ENTITY,
  SET_STUDY_ENTITIES,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
} from '../constants';

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
    case SUBSCRIBE_USER:
      return newState;
    case UNSUBSCRIBE_USER:
      return newState;
    default:
      return state;
  }
}
