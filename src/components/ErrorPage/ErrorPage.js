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
import s from './ErrorPage.scss';

let title = 'Error';
let content = 'Sorry, a critical error occurred on this page.';

class ErrorPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  static propTypes = {
    statusCode: PropTypes.number,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    if (this.props.statusCode === 404) {
      title = 'Page Not Found';
      content = 'Sorry, the page you were trying to view does not exist.';
    }

    return (
      <div>
        <h1>{title}</h1>
        <p>{content}</p>
      </div>
    );
  }

}

export default withStyles(ErrorPage, s);
