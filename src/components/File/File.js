import React from 'react';
import PropTypes from 'prop-types';

const File = ({ file }) => (
  <span>
    <a href={`/api/get_file/${file.id}`}>{file.internalName}</a>
  </span>
);

File.propTypes = {
  file: PropTypes.shape({
    url: PropTypes.string.isRequired,
    internalName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default File;
