import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modals';

class NewModal extends Component {
  static propTypes = {
    modalId: PropTypes.string.isRequired,
    hideModal: PropTypes.func.isRequired,
    modals: PropTypes.instanceOf(Object).isRequired,
    children: PropTypes.instanceOf(Array).isRequired,
  };

  handleClose = () => {
    this.props.hideModal(this.props.modalId);
  };

  render() {
    return (
      <Modal
        show={this.props.modals[this.props.modalId]}
        onHide={this.handleClose}
      >
        {this.props.children}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modals: state.modals,
});
export default Object.assign(
  connect(
    mapStateToProps,
    { hideModal },
  )(NewModal),
  { Body: Modal.Body, Footer: Modal.Footer },
);
