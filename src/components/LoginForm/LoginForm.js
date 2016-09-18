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
import s from './LoginForm.css';

class LoginForm extends Component {

  static propTypes = { onSubmit: PropTypes.func };

  constructor(props) {
    super(props);

    this.state = { usernameOrEmail: '', password: '' };
    this.handleUsernameOrEmailChange = this.handleUsernameOrEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameOrEmailChange(e) {
    this.setState({ usernameOrEmail: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { usernameOrEmail, password } = this.state;
    this.props.onSubmit(usernameOrEmail, password);
  }

  render() {
    const { usernameOrEmail, password } = this.state;
    return (
      <form className={s.root} method="post" onSubmit={this.handleSubmit}>
        <div className={s.formGroup}>
          <label className={s.label} htmlFor="usernameOrEmail">
            Username or email address:
          </label>
          <input
            className={s.input}
            id="usernameOrEmail"
            type="text"
            name="usernameOrEmail"
            value={usernameOrEmail}
            onChange={this.handleUsernameOrEmailChange}
            autoFocus
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
            Log in
          </button>
        </div>
      </form>
    );
  }
}

export default withStyles(s)(LoginForm);
