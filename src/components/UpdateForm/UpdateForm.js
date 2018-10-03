import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Button,
} from 'react-bootstrap';

export default class UpdateForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  state = {
    title: this.props.title,
  };

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit({
      ...this.state,
    });
  };

  render() {
    const { title } = this.state;
    return (
      <form>
        <FormGroup controlId="title">
          <ControlLabel>Title</ControlLabel>
          <FormControl
            autoFocus
            type="text"
            value={title}
            onChange={this.handleChange('title')}
          />
          <HelpBlock>Title can not be empty</HelpBlock>
        </FormGroup>
        <Button
          type="submit"
          bsStyle="primary"
          disabled={title.length === 0}
          onClick={this.handleSubmit}
        >
          Save
        </Button>
      </form>
    );
  }
}
