import {
  FETCH_CONTENT_START,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_ERROR,
} from '../constants';

const defaultState = {};

const createKey = (path, locale) => `${locale}:${path}`;

// selectors
export function selectContent(state, { path, locale }) {
  const key = createKey(path, locale || state.intl.locale);
  return state.content[key] || null;
}

// reducer
export default function content(state = defaultState, action) {
  switch (action.type) {
    case FETCH_CONTENT_START: {
      const key = createKey(action.payload.path, action.payload.locale);
      return {
        ...state,
        [key]: {
          ...state[key],
          isFetching: true,
        },
      };
    }

    case FETCH_CONTENT_SUCCESS: {
      const key = createKey(action.payload.path, action.payload.locale);
      return {
        ...state,
        [key]: {
          ...action.payload,
          isFetching: false,
        },
      };
    }

    case FETCH_CONTENT_ERROR: {
      const key = createKey(action.payload.path, action.payload.locale);
      return {
        ...state,
        [key]: {
          ...state[key],
          ...action.payload,
          isFetching: false,
        },
      };
    }

    default: {
      return state;
    }
  }
}
