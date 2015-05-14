/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars
import { withStyles } from '../decorators'; // eslint-disable-line no-unused-vars
import styles from './NotFoundPage.less'; // eslint-disable-line no-unused-vars

@withStyles(styles)
class NotFoundPage {

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  render() {
    let title = 'Page Not Found';
    this.context.onSetTitle(title);
    this.context.onPageNotFound();
    return (
      <div>
        <h1>{title}</h1>
        <p>Sorry, but the page you were trying to view does not exist.</p>
      </div>
    );
  }

}

export default NotFoundPage;
