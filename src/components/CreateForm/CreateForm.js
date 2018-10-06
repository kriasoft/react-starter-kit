import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Button,
} from 'react-bootstrap';
import TextEditor from '../TextEditor/TextEditor';

export default class CreateForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  };

  state = {
    title: this.props.title,
    body: this.props.body,
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
    const { title, body } = this.state;
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
        <FormGroup controlId="editor">
          <TextEditor value={body} onChange={this.handleChange('body')} />
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
