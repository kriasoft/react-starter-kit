import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Row, Col } from 'react-bootstrap';
import UsersTable from '../UsersTable/UsersTable';

class ModalWithUsers extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    usersLeft: PropTypes.element.isRequired,
    usersRight: PropTypes.element.isRequired,
  };
  render() {
    const { show, handleClose, usersLeft, usersRight } = this.props;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Grid fluid>
            <Row>
              <Col md={6}>
                <h4>Subscribed</h4>
                <UsersTable users={usersLeft} />
              </Col>
              <Col md={6}>
                <h4>Unsubscribed</h4>
                <UsersTable users={usersRight} />
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalWithUsers;
