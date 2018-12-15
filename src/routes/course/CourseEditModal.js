import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
} from 'react-bootstrap';
import { updateCourse } from '../../actions/courses';
import Modal from '../../components/Modal';

class CourseEditModal extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    modalId: PropTypes.string.isRequired,
    course: PropTypes.shape.isRequired,
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <Modal
        modalId={this.props.modalId}
        defaultFooter="save_close"
        onSubmit={() =>
          this.props.dispatch(updateCourse(this.state.courseTitle))
        }
      >
        <Modal.Body>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              name="courseTitle"
              value={this.state.courseTitle || this.props.course.title}
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

export default connect(mapStateToProps)(CourseEditModal);
