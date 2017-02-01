/* eslint-disable css-modules/no-undef-class */
/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LoginForm.css';

function LoginForm() {
  return (
    <form method="post">
      <div className={s.formGroup}>
        <label className={s.label} htmlFor="usernameOrEmail">
          Username or email address:
        </label>
        <input
          className={s.input}
          id="usernameOrEmail"
          type="text"
          name="usernameOrEmail"
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

export default withStyles(s)(LoginForm);
