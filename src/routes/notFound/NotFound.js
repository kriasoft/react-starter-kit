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
import s from './NotFound.css';

function NotFound({ title }) {
  return (
    <Layout full={false}>
      <div className={s.root}>
        <div className={s.container}>
          <h1>{title}</h1>
          <p>Sorry, the page you were trying to view does not exist.</p>
        </div>
      </div>
    </Layout>
  );
}

NotFound.propTypes = {
  title: PropTypes.string.isRequired,
};

export default withStyles(s)(NotFound);
