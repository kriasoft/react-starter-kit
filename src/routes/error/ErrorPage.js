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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ErrorPage.css';

class ErrorPage extends React.Component {
  static propTypes = {
    error: PropTypes.shape({
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      stack: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    error: null,
  };

  render() {
    if (__DEV__ && this.props.error) {
      return (
        <React.Fragment>
          <h1>{this.props.error.name}</h1>
          <pre>{this.props.error.stack}</pre>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h1>Error</h1>
        <p>Sorry, a critical error occurred on this page.</p>
      </React.Fragment>
    );
  }
}

export { ErrorPage as ErrorPageWithoutStyle };
export default withStyles(s)(ErrorPage);
