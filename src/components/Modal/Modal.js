import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { hideModal } from '../../actions/modals';

class NewModal extends Component {
  static propTypes = {
    modalId: PropTypes.string.isRequired,
    modals: PropTypes.instanceOf(Object).isRequired,
    children: PropTypes.element.isRequired,
    defaultFooter: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    defaultFooter: '',
    onSubmit: () => {
      // eslint-disable-next-line no-throw-literal
      throw `onSubmit is undefined in ${this.props.modalId}`;
    },
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit();
    // eslint-disable-next-line react/prop-types
    this.props.hideModal(this.props.modalId);
  };

  handleClose = () => {
    this.props.hideModal(this.props.modalId);
  };

  renderDefaultFooter() {
    switch (this.props.defaultFooter) {
      case 'close':
        return (
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        );
      case 'add_close':
        return (
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleSubmit}>
              Add
            </Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        );
      case 'save_close':
        return (
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleSubmit}>
              Save
            </Button>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        );
      default:
        return undefined;
    }
  }

  render() {
    return (
      <Modal
        show={this.props.modals[this.props.modalId]}
        onHide={this.handleClose}
      >
        {this.props.children}
        {this.renderDefaultFooter()}
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
