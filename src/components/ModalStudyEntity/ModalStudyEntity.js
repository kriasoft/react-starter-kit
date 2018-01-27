import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, FormControl } from 'react-bootstrap';
import TextEditor from '../../components/TextEditor';

class ModalStudyEntity extends React.Component {
  static propTypes = {
    isShowed: PropTypes.bool.isRequired,
    state: PropTypes.shape({ studyEntityName: PropTypes.string.isRequired })
      .isRequired,
    onInputChange: PropTypes.func.isRequired,
    onEditorChange: PropTypes.func.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    onCloseClick: PropTypes.func.isRequired,
  };
  render() {
    const {
      isShowed,
      state,
      onInputChange,
      onEditorChange,
      onSubmitClick,
      onCloseClick,
    } = this.props;

    return (
      <Modal show={isShowed} onHide={onCloseClick}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Course name</h4>
          <FormControl
            type="text"
            value={state.studyEntityName}
            onChange={onInputChange}
          />
          <div>
            <br />
            <TextEditor
              value={state.studyEntityBody}
              onChange={onEditorChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onSubmitClick}>Add study entity</Button>
          <Button onClick={onCloseClick}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalStudyEntity;
