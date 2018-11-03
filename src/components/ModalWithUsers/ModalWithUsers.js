import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import CourseUsers from '../CourseUsers/CourseUsers';

class ModalWithUsers extends Component {
  static propTypes = {
    toggleButton: PropTypes.func.isRequired,
  };
  state = {
    show: false,
  };

  handleToggle = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  render() {
    const { show } = this.state;
    const { toggleButton } = this.props;

    return (
      <Fragment>
        {toggleButton(this.handleToggle)}
        <Modal show={show} onHide={this.handleToggle} bsSize="large">
          <Modal.Body>
            <CourseUsers />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleToggle}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

export default ModalWithUsers;
