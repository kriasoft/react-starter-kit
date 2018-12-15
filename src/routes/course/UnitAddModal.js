import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import Modal from '../../components/Modal';
import TextEditor from '../../components/TextEditor/TextEditor';
import { addUnit } from '../../actions/units';

class UnitAddModal extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { title, body } = this.state;
    return (
      <Modal
        modalId={this.props.modalId}
        defaultFooter="add_close"
        onSubmit={() => this.props.dispatch(addUnit({ title, body }))}
      >
        <Modal.Body>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={title}
              name="title"
              onChange={this.handleChange}
            />
            <HelpBlock>Title can not be empty</HelpBlock>
          </FormGroup>
          <FormGroup controlId="editor">
            <TextEditor
              value={body}
              onChange={value => this.setState({ body: value })}
            />
          </FormGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  course: state.course,
});

export default connect(mapStateToProps)(UnitAddModal);
