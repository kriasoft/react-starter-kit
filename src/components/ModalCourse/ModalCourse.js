import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { updateCourse, createCourse } from '../../actions/courses';
import Modal from '../../components/Modal';

class ModalCourse extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
    course: PropTypes.shape.isRequired,
    edit: PropTypes.bool,
  };

  static defaultProps = {
    edit: true,
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { course, edit } = this.props;
    const { title = course.title } = this.state;
    return (
      <Modal
        modalId={this.props.modalId}
        defaultFooter={edit ? 'save_close' : 'add_close'}
        onSubmit={() =>
          this.props.dispatch(edit ? updateCourse(title) : createCourse(title))
        }
      >
        <Modal.Body>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              name="title"
              value={title}
              onChange={this.handleChange}
            />
            <HelpBlock>Title can not be empty</HelpBlock>
          </FormGroup>
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  course: state.course,
});

export default connect(mapStateToProps)(ModalCourse);
