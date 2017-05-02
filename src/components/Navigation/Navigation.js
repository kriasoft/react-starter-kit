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
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { graphql, createFragmentContainer } from 'react-relay';
import s from './Navigation.css';
import Link from '../Link';

class Navigation extends React.Component {
  static contextTypes = {
    api: PropTypes.shape({
      fetch: PropTypes.func.isRequired,
    }).isRequired,
  };

  static propTypes = {
    // eslint-disable-next-line react/require-default-props
    me: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }),
  }

  logout = (event) => {
    event.preventDefault();
    this.context.api.fetch('/logout', { method: 'POST' }).then(() => {
      window.location.href = '/';
    });
  };

  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/about">About</Link>
        <Link className={s.link} to="/contact">Contact</Link>
        <span className={s.spacer}> | </span>
        {this.props.me ? [
          <span key={'i1'} className={s.link}>Welcome, {this.props.me.email}!</span>,
          <span key={'i2'} className={s.spacer}>|</span>,
          <Link key={'i3'} className={s.link} to="/login" onClick={this.logout}>Logout</Link>,
        ] : [
          <Link key={'i1'} className={s.link} to="/login">Log in</Link>,
          <span key={'i2'} className={s.spacer}>or</span>,
          <Link key={'i3'} className={cx(s.link, s.highlight)} to="/register">Sign up</Link>,
        ]}
      </div>
    );
  }
}

export default createFragmentContainer(withStyles(s)(Navigation), graphql`
  fragment Navigation_me on User {
    email
  }
`);
