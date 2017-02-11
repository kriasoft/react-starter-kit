/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

const messages = defineMessages({
  about: {
    id: 'navigation.about',
    defaultMessage: 'About',
    description: 'About link in header',
  },
  contact: {
    id: 'navigation.contact',
    defaultMessage: 'Contact',
    description: 'Contact link in header',
  },
  login: {
    id: 'navigation.login',
    defaultMessage: 'Log in',
    description: 'Log in link in header',
  },
  or: {
    id: 'navigation.separator.or',
    defaultMessage: 'or',
    description: 'Last separator in list, lowercase "or"',
  },
  signup: {
    id: 'navigation.signup',
    defaultMessage: 'Sign up',
    description: 'Sign up link in header',
  },
});

class Navigation extends React.Component {
  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">
          <FormattedMessage {...messages.about} />
        </Link>
        <Link className={s.link} to="/contact">
          <FormattedMessage {...messages.contact} />
        </Link>
        <span className={s.spacer}> | </span>
        <Link className={s.link} to="/login">
          <FormattedMessage {...messages.login} />
        </Link>
        <span className={s.spacer}>
          <FormattedMessage {...messages.or} />
        </span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          <FormattedMessage {...messages.signup} />
        </Link>
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
