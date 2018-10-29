import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import File from '../File';

function FilesList({ files = [] }) {
  return files.length ? (
    <ListGroup>
      {files.map(file => (
        <ListGroupItem key={file.id}>
          <File file={file} />
        </ListGroupItem>
      ))}
    </ListGroup>
  ) : (
    <p>You have no files yet</p>
  );
}

FilesList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      internalName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default FilesList;
