import { SET_ANSWER, ADD_MARK } from '../constants';

export default function answer(state = { marks: [] }, action) {
  switch (action.type) {
    case SET_ANSWER:
      return action.data;
    case ADD_MARK:
      return { ...state, marks: [...state.marks, action.data] };
    default:
      return state;
  }
}
