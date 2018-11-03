import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Glyphicon } from 'react-bootstrap';
import UpdateForm from '../UpdateForm/UpdateForm';

export default class ModalAdd extends Component {
  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    title: PropTypes.string,
    buttonText: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    buttonText: '',
  };

  state = {
    show: false,
  };

  handleToggle = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleFormSubmit = ({ title }) => {
    this.handleToggle();
    this.props.onUpdate(title);
  };

  render() {
    const { title, buttonText } = this.props;
    const { show } = this.state;
    return (
      <Fragment>
        <Button onClick={this.handleToggle}>
          {buttonText || <Glyphicon glyph={title ? 'pencil' : 'plus'} />}
        </Button>
        <Modal show={show} onHide={this.handleToggle}>
          <Modal.Body>
            <UpdateForm title={title} onSubmit={this.handleFormSubmit} />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleToggle}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
