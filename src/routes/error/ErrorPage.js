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
import s from './ErrorPage.css';

function ErrorPage({ error }) {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div>
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>{error.name}</h1>
      <p>{error.message}</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

ErrorPage.propTypes = { error: PropTypes.object.isRequired };

export { ErrorPage as ErrorPageWithoutStyle };
export default withStyles(s)(ErrorPage);
