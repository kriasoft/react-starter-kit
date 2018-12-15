import {
  ADD_USER_TO_GROUP,
  DELETE_USER_FROM_GROUP,
  SET_GROUPS,
  ADD_GROUP,
  UPDATE_GROUP,
} from '../constants';

export default function groups(state = [], action) {
  switch (action.type) {
    case ADD_USER_TO_GROUP: {
      const g = state.find(gr => gr.id === action.data.groupId);
      const i = state.indexOf(g);
      return [
        ...state.slice(0, i),
        { ...g, users: [...g.users, action.data.user] },
        ...state.slice(i + 1),
      ];
    }

    case DELETE_USER_FROM_GROUP: {
      const g = state.find(gr => gr.id === action.data.groupId);
      const i = state.indexOf(g);
      const ulist = g.users.filter(u => u.id !== action.data.user.id);
      return [
        ...state.slice(0, i),
        { ...g, users: ulist },
        ...state.slice(i + 1),
      ];
    }

    case SET_GROUPS:
      return [...action.data];

    case ADD_GROUP:
      return [...state, action.data];

    case UPDATE_GROUP:
      return state.map(g => {
        if (g.id !== action.data.id) {
          return g;
        }
        return { ...g, title: action.data.title };
      });

    default:
      return state;
  }
}
