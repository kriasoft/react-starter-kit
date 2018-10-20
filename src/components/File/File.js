import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

const File = ({ file }) => (
  <span>
    <Link to={`/api/get_file/${file.id}`}>{file.internalName}</Link>
  </span>
);

File.propTypes = {
  file: PropTypes.shape({
    url: PropTypes.string,
    internalName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default File;
