import React from 'react';
import PropTypes from 'prop-types';
import File from '../File';

const FilesList = ({ files }) => (
  <ol>
    {files.map(file => (
      <li key={file.id}>
        <File file={file} />
      </li>
    ))}
  </ol>
);

FilesList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      internalName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FilesList;
