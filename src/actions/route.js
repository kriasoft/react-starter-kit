
// Pseudo action. All is handled through history module
export function redirect(descriptor) {
  return (dispatch, _, { history }) => history.replace(descriptor);
}

export function navigate(descriptor) {
  return (dispatch, _, { history }) => history.push(descriptor);
}
