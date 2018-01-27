/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  FormGroup,
} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Register.css';

class Register extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      validation: {},
      email: '',
      password: '',
      password2: '',
    };
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onPassword2Change = this.onPassword2Change.bind(this);
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
    this.updateValidationState();
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onPassword2Change(event) {
    this.setState({ password2: event.target.value });
    this.updateValidationState();
  }

  updateValidationState() {
    this.setState({
      validation: {
        email: /^[a-zA-Z0-9+.\-_]+@[a-zA-Z0-9+.\-_]+$/.test(this.state.email)
          ? 'success'
          : 'error',
        password:
          this.state.password === this.state.password2 ? 'success' : 'error',
      },
    });
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Fill the form with your data.</p>
          <form method="post">
            <FormGroup
              className={s.formGroup}
              validationState={this.state.validation.email}
            >
              <label className={s.label} htmlFor="email">
                Email address:
                <FormControl
                  className={s.input}
                  onChange={this.onEmailChange}
                  id="email"
                  type="text"
                  name="email"
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
              </label>
            </FormGroup>
            <FormGroup className={s.formGroup}>
              <label className={s.label} htmlFor="password">
                Password:
                <FormControl
                  className={s.input}
                  onChange={this.onPasswordChange}
                  id="password"
                  type="password"
                  name="password"
                />
              </label>
            </FormGroup>
            <FormGroup
              className={s.formGroup}
              validationState={this.state.validation.password}
            >
              <label className={s.label} htmlFor="password2">
                Repeat password:
                <FormControl
                  className={s.input}
                  onChange={this.onPassword2Change}
                  id="password2"
                  type="password"
                  name="password2"
                />
              </label>
            </FormGroup>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="Name">
                Name:
                <input className={s.input} id="name" type="text" name="name" />
              </label>
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="Gender">
                Gender:
                <ButtonToolbar>
                  <ToggleButtonGroup type="radio" name="gender">
                    <ToggleButton value="male">Male</ToggleButton>
                    <ToggleButton value="female">Female</ToggleButton>
                  </ToggleButtonGroup>
                </ButtonToolbar>
              </label>
            </div>
            <div className={s.formGroup}>
              <button className={s.button} type="submit">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
