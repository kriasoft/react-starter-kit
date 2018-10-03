import React, { Component, Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import CourseUsers from '../CourseUsers/CourseUsers';

class ModalWithUsers extends Component {
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

    return (
      <Fragment>
        <Button bsStyle="primary" onClick={this.handleToggle}>
          Subscribe user
        </Button>
        <Modal show={show} onHide={this.handleToggle}>
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
