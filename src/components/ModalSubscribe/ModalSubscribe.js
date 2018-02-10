import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'react-bootstrap';

class ModalSubscribe extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    subscribedUsers: PropTypes.element.isRequired,
    unsubscribedUsers: PropTypes.element.isRequired,
  };
  render() {
    const {
      show,
      handleClose,
      subscribedUsers,
      unsubscribedUsers,
    } = this.props;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h4>Subscribed</h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>User email</th>
                  </tr>
                </thead>
                <tbody>{subscribedUsers}</tbody>
              </Table>
            </div>
            <div className="col-md-6">
              <h4>Unsubscribed</h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>User email</th>
                  </tr>
                </thead>
                <tbody>{unsubscribedUsers}</tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalSubscribe;
