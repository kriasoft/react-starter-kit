export default function users(state = {}, action) {
  const nextState = { ...state };
  switch (action.type) {
    case 'SET_GROUPS':
      nextState.groups = action.data;
      return nextState;
    case 'ADD_GROUP':
      nextState.groups = state.groups || [];
      nextState.groups.push(action.data);
      return nextState;
    default:
      return state;
  }
}
