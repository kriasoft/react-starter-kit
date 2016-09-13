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
import s from './Register.css';
import RegisterForm from '../../components/RegisterForm';
import fetch from '../../core/fetch';

class Register extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  async onSubmit(username, email, password) {
    const resp = await fetch('/graphql', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `mutation{userRegister(username:"${username}",email:"${email}",password:"${password}"){id}}`,
      }),
      credentials: 'include',
    });
    const { data } = await resp.json();
    if (data.id) {
      // Redirect
    }
  }

  render() {
    const { title } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <RegisterForm onSubmit={this.onSubmit} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Register);
