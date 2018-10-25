import { SET_FILES, ADD_FILE } from '../constants';
import loadFiles from '../gql/loadFiles.gql';

export function setFiles(files) {
  return {
    type: SET_FILES,
    data: files,
  };
}

export function addFile({ id, internalName, user }) {
  return {
    type: ADD_FILE,
    data: {
      id,
      internalName,
      owner: user.id,
    },
  };
}

export function fetchFiles() {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadFiles);
    return dispatch(setFiles(data.files));
  };
}
