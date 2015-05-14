/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react'; // eslint-disable-line no-unused-vars
import classNames from 'classnames';
import styles from './Navigation.less'; // eslint-disable-line no-unused-vars
import { withStyles } from '../decorators'; // eslint-disable-line no-unused-vars
import Link from '../../utils/Link';

@withStyles(styles)
class Navigation {

  render() {
    return (
      <div className={classNames(this.props.className, 'Navigation')} role="navigation">
        <a className="Navigation-link" href="/about" onClick={Link.handleClick}>About</a>
        <a className="Navigation-link" href="/contact" onClick={Link.handleClick}>Contact</a>
        <span className="Navigation-spacer"> | </span>
        <a className="Navigation-link" href="/login" onClick={Link.handleClick}>Log in</a>
        <span className="Navigation-spacer">or</span>
        <a className="Navigation-link Navigation-link--highlight" href="/register" onClick={Link.handleClick}>Sign up</a>
      </div>
    );
  }

}

export default Navigation;
