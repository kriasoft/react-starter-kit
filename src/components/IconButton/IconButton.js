import React from 'react';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';

const IconButton = ({ onClick, glyph }) => (
  <Button onClick={onClick}>
    <Glyphicon glyph={`glyphicon glyphicon-${glyph}`} />
  </Button>
);

IconButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  glyph: PropTypes.string.isRequired,
};

export default IconButton;
