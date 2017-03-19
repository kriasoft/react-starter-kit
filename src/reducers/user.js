import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../constants';

const INITIAL_STATE = {
  loading: false,
};

export default function user(state = {}, action) {
  if (state === null) { // server doesn't suppprt state = {}
    return INITIAL_STATE;
  }
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        loading: true,
        user: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        user: null,
      };
    default:
      return state;
  }
}
