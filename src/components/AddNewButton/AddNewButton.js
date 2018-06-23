import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

const AddNewButton = ({ onClick }) => (
  <Button onClick={onClick}>
    <Glyphicon glyph="glyphicon glyphicon-plus" />
  </Button>
);

AddNewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddNewButton;
