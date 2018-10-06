import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import IconButton from '../IconButton/IconButton';
import CreateForm from '../CreateForm/CreateForm';

export default class ModalEditor extends Component {
  static propTypes = {
    onCreate: PropTypes.func.isRequired,
    title: PropTypes.string,
    body: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    body: '',
  };

  state = {
    show: false,
  };

  handleToggle = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleFormSubmit = unit => {
    this.handleToggle();
    this.props.onCreate(unit);
  };

  render() {
    const { show } = this.state;
    const { title, body } = this.props;
    return (
      <Fragment>
        <IconButton
          onClick={this.handleToggle}
          glyph={title ? 'pencil' : 'plus'}
        />
        <Modal show={show} onHide={this.handleToggle}>
          <Modal.Body>
            <CreateForm
              title={title}
              body={body}
              onSubmit={this.handleFormSubmit}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleToggle}>Close</Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}
