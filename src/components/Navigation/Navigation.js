/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react'; // eslint-disable-line no-unused-vars
import cx from 'classnames';
import './Navigation.less';

class Navigation {

  render() {
    return (
      <div className={cx(this.props.className, 'Navigation')} role="navigation">
        <a className="Navigation-link" href="/about">About</a>
        <a className="Navigation-link" href="/contact">Contact</a>
        <span className="Navigation-spacer"> | </span>
        <a className="Navigation-link" href="/login">Log in</a>
        <span className="Navigation-spacer">or</span>
        <a className="Navigation-link Navigation-link--highlight" href="/register">Sign up</a>
      </div>
    );
  }

}

export default Navigation;
