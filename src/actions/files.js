import { SET_FILES, ADD_FILE } from '../constants';

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
