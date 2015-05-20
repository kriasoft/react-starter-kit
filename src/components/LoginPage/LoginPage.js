/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import styles from './LoginPage.less'; // eslint-disable-line no-unused-vars
import withStyles from '../decorators/withStyles'; // eslint-disable-line no-unused-vars

@withStyles(styles)
class LoginPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired
  };

  render() {
    let title = 'Log In';
    this.context.onSetTitle(title);
    return (
      <div className="LoginPage">
        <div className="LoginPage-container">
          <h1>{title}</h1>
          <p>...</p>
        </div>
      </div>
    );
  }

}

export default LoginPage;
