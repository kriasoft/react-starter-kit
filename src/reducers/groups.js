import {
  ADD_USER_TO_GROUP,
  SET_GROUP,
  DELETE_USER_FROM_GROUP,
  SET_GROUPS,
  ADD_GROUP,
  UPDATE_GROUP,
} from '../constants';

const initialState = {
  groups: [],
  group: {},
};

export default function groups(state = initialState, action) {
  switch (action.type) {
    case ADD_USER_TO_GROUP: {
      // const groups = [...state.groups];
      // const group = groups.find(g => g.id === action.data.groupId);
      // groups[i] = { ...group, users: [...group.users] };
      // groups[i].users.push(action.data.user);
      const g = state.groups.find(gr => gr.id === action.data.groupId);
      const i = state.groups.indexOf(g);
      return {
        ...state,
        groups: [
          ...state.groups.slice(0, i),
          { ...g, users: [...g.users, action.data.user] },
          ...state.groups.slice(i + 1),
        ],
      };
    }

    case DELETE_USER_FROM_GROUP: {
      const g = state.groups.find(gr => gr.id === action.data.groupId);
      const i = state.groups.indexOf(g);
      const ulist = g.users.filter(u => u.id !== action.data.user.id);
      return {
        ...state,
        groups: [
          ...state.groups.slice(0, i),
          { ...g, users: ulist },
          ...state.groups.slice(i + 1),
        ],
      };
    }

    case SET_GROUP:
      // const groups = [...state.groups];
      // const group = groups.find(g => g.id === action.data.groupId);
      // const i = groups.indexOf(group);
      // groups[i] = { ...group, users: [...group.users] };
      // groups[i].users.push(action.data.user);
      return { ...state, group: action.data };

    case SET_GROUPS:
      return { ...state, groups: action.data };

    case ADD_GROUP:
      return { ...state, groups: [...state.groups, action.data] };

    case UPDATE_GROUP:
      return {
        ...state,
        groups: state.groups.map(g => {
          if (g.id !== action.data.id) {
            return g;
          }
          return { ...g, title: action.data.title };
        }),
      };

    default:
      return state;
  }
}
