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
import s from './ErrorPage.scss';

function ErrorPage({ error }) {
  return (
    <div>
      <h1>{error.status === 404 ? 'Page Not Found' : 'Error'}</h1>
      <p>
        {
          error.status === 404
            ? 'Sorry, the page you were trying to view does not exist.'
            : 'Sorry, a critical error occurred on this page.'
        }
      </p>
      {
        process.env.NODE_ENV !== 'production' &&
        <pre>{error.stack}</pre>
      }
    </div>
  );
}

ErrorPage.propTypes = { error: PropTypes.object.isRequired };

export default withStyles(s)(ErrorPage);
