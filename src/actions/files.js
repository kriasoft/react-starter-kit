import { SET_FILES, ADD_FILE } from '../constants';
import loadFiles from '../gql/loadFiles.gql';

export function setFiles(files) {
  return {
    type: SET_FILES,
    data: files,
  };
}

export function addFile({ id, internalName, owner }) {
  return {
    type: ADD_FILE,
    data: {
      id,
      internalName,
      owner,
    },
  };
}

export function fetchFiles() {
  return async (dispatch, _, { graphqlRequest }) => {
    const { data } = await graphqlRequest(loadFiles);
    dispatch(setFiles(data.files));
  };
}
