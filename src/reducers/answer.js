import { SET_ANSWER, SET_ANSWER_BODY, ADD_MARK } from '../constants';

export default function answer(state = { marks: [] }, action) {
  switch (action.type) {
    case SET_ANSWER:
      return action.data;
    case SET_ANSWER_BODY:
      return { ...state, body: action.data };
    case ADD_MARK:
      return { ...state, marks: [...state.marks, action.data] };
    default:
      return state;
  }
}
