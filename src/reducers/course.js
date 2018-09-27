import {
  ADD_UNIT,
  SET_UNITS,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
} from '../constants';

const initialState = {
  subscribedUsers: [],
  units: [],
};

export default function units(state = initialState, action) {
  switch (action.type) {
    case ADD_UNIT:
      return { ...state, units: [...state.units, action.data] };
    case SET_UNITS:
      return { ...state, units: action.data };
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
