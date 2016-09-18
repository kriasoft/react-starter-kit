/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RegisterForm.css';

class RegisterForm extends Component {

  static propTypes = { onSubmit: PropTypes.func };

  constructor(props) {
    super(props);

    this.state = { username: '', email: '', password: '' };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    if (password.length < 8) throw new Error('Password must be at least 8 characters long');
    this.props.onSubmit(username, email, password);
  }

  render() {
    const { username, email, password } = this.state;
    return (
      <form className={s.root} method="post" onSubmit={this.handleSubmit}>
        <div className={s.formGroup}>
          <label className={s.label} htmlFor="username">
            Username:
          </label>
          <input
            className={s.input}
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={this.handleUsernameChange}
            autoFocus
          />
        </div>
        <div className={s.formGroup}>
          <label className={s.label} htmlFor="email">
            Email address:
          </label>
          <input
            className={s.input}
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={this.handleEmailChange}
          />
        </div>
        <div className={s.formGroup}>
          <label className={s.label} htmlFor="password">
            Password:
          </label>
          <input
            className={s.input}
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={this.handlePasswordChange}
          />
        </div>
        <div className={s.formGroup}>
          <button className={s.button} type="submit">
            Register
          </button>
        </div>
      </form>
    );
  }
}

export default withStyles(s)(RegisterForm);
