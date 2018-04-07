import {
  ADD_STUDY_ENTITY,
  SET_STUDY_ENTITIES,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
} from '../constants';

const initialState = {
  subscribedUsers: [],
  studyEntities: [],
};

export default function studyEntities(state = initialState, action) {
  switch (action.type) {
    case ADD_STUDY_ENTITY:
      return { ...state, studyEntities: [...state.studyEntities, action.data] };
    case SET_STUDY_ENTITIES:
      return { ...state, studyEntities: action.data };
    case SUBSCRIBE_USER:
      return {
        ...state,
        subscribedUsers: [...state.subscribedUsers, action.data],
      };
    case UNSUBSCRIBE_USER:
      return state;
    default:
      return state;
  }
}
