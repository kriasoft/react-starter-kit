import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormControl } from 'react-bootstrap';

const ModalAdd = ({
  value,
  title,
  show,
  onInputChange,
  onSubmitClick,
  handleClose,
  submitText,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Body>
      <h4>{title} name</h4>
      <FormControl type="text" value={value} onChange={onInputChange} />
      <div />
    </Modal.Body>
    <Modal.Footer>
      <Button disabled={value.length === 0} onClick={onSubmitClick}>
        {submitText} {title}
      </Button>
      <Button onClick={handleClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ModalAdd.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  submitText: PropTypes.string.isRequired,
};

export default ModalAdd;
