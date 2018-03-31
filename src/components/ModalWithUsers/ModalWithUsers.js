import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Table } from 'react-bootstrap';

class ModalWithUsers extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    titleLeft: PropTypes.string.isRequired,
    usersLeft: PropTypes.element.isRequired,
    titleRight: PropTypes.string.isRequired,
    usersRight: PropTypes.element.isRequired,
  };
  render() {
    const {
      show,
      handleClose,
      titleLeft,
      usersLeft,
      titleRight,
      usersRight,
    } = this.props;

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <h4>{titleLeft}</h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>User email</th>
                  </tr>
                </thead>
                <tbody>{usersLeft}</tbody>
              </Table>
            </div>
            <div className="col-md-6">
              <h4>{titleRight}</h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th>User email</th>
                  </tr>
                </thead>
                <tbody>{usersRight}</tbody>
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

export default ModalWithUsers;
