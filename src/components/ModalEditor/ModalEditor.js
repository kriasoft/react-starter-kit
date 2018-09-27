import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormControl } from 'react-bootstrap';
import TextEditor from '../../components/TextEditor';

const ModalEditor = ({
  title,
  show,
  unitName,
  unitBody,
  onInputChange,
  onEditorChange,
  onSubmitClick,
  handleClose,
}) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Body>
      <h4>{title} name</h4>
      <FormControl type="text" value={unitName} onChange={onInputChange} />
      <div>
        <br />
        <TextEditor value={unitBody} onChange={onEditorChange} />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button disabled={unitName.length === 0} onClick={onSubmitClick}>
        Add {title}
      </Button>
      <Button onClick={handleClose}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ModalEditor.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  unitName: PropTypes.string.isRequired,
  unitBody: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEditorChange: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalEditor;
