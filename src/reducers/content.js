import {
  FETCH_CONTENT_START,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
} from '../constants';

const defaultState = {};

export default function runtime(state = defaultState, action) {
  const key = action.payload && `${action.payload.locale}:${action.payload.path}`;
  switch (action.type) {
    case FETCH_CONTENT_START:
      return {
        ...state,
        [key]: {
          ...state[key],
          isFetching: true,
        },
      };
    case FETCH_CONTENT_SUCCESS:
      return {
        ...state,
        [key]: {
          ...action.payload,
          isFetching: false,
        },
        currentAvailableKey: key,
      };
    case FETCH_CONTENT_ERROR:
      return {
        ...state,
        [key]: {
          ...state[key],
          ...action.payload,
          isFetching: false,
        },
      };
    default:
      return state;
  }
}
