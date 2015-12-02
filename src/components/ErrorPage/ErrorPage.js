/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { Component, PropTypes } from 'react';
import s from './ErrorPage.scss';
import withStyles from '../../decorators/withStyles';

const title = 'Error';

@withStyles(s)
class ErrorPage extends Component {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    return (
      <div>
        <h1>{title}</h1>
        <p>Sorry, an critical error occurred on this page.</p>
      </div>
    );
  }

}

export default ErrorPage;
