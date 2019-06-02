/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import s from './Register.css';

type PropTypes = {
  title: string;
};

const Register = (props: PropTypes) => {
  useStyles(s);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>{props.title}</h1>
        <p>...</p>
      </div>
    </div>
  );
};

export default Register;
