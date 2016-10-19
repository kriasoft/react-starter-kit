/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../components/Layout';

import LoginFacebook from '../../components/LoginFacebook';
import LoginGoogle from '../../components/LoginGoogle';
import LoginTwitter from '../../components/LoginTwitter';
import LoginForm from '../../components/LoginForm';

import s from './Login.css';

function Login({ title }) {
  return (
    <Layout>
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p className={s.lead}>Log in with your username or company email address.</p>
          <LoginFacebook className={s.formGroup}></LoginFacebook>

          <LoginGoogle className={s.formGroup}></LoginGoogle>

          <LoginTwitter className={s.formGroup}></LoginTwitter>

          <strong className={s.lineThrough}>OR</strong>

          <LoginForm></LoginForm>
        </div>
      </div>
    </Layout>
  );
}

Login.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(Login);
