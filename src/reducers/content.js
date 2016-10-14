import {
  GET_LOCALE_CONTENT,
  GET_LOCALE_CONTENT_SUCCESS,
  GET_LOCALE_CONTENT_ERROR,
} from '../constants';

const defaultState = {
  isFetching: false,
  data: {
    title: '', content: '',
  },
};

export default function runtime(state = defaultState, action) {
  switch (action.type) {
    case GET_LOCALE_CONTENT:
      return {
        ...state,
        isFetching: true,
      };
    case GET_LOCALE_CONTENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        data: action.payload.data,
      };
    case GET_LOCALE_CONTENT_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
