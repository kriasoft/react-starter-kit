/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

async function getMeData() {
  const resp = await fetch('/graphql', {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: '{me{id,email}}',
    }),
    credentials: 'include',
  });

  const { data } = await resp.json();
  if (!data || !data.me) throw new Error('can\'t load third party me data');

  return data;
}

function generateNavigationItems(state) {
  let navigationItems = [];

  navigationItems = [
    {
      label: 'About',
      to: '/about',
      className: s.link,
    },
    {
      label: 'Contact',
      to: '/contact',
      className: s.link,
    },
    {
      label: ' | ',
      className: s.spacer,
    },
  ];

  if (state.me != null) {
    navigationItems.push({
      label: 'Dashboard',
      to: '/dashboar',
      className: s.link,
    });
    navigationItems.push({
      label: 'or',
      className: s.spacer,
    });
    navigationItems.push({
      label: 'logout',
      to: '/logout',
      className: cx(s.link, s.highlight),
    });
  } else {
    navigationItems.push({
      label: 'Log in',
      to: '/login',
      className: s.link,
    });
    navigationItems.push({
      label: 'or',
      className: s.spacer,
    });
    navigationItems.push({
      label: 'Sign up',
      to: '/register',
      className: cx(s.link, s.highlight),
    });
  }
  return navigationItems;
}


class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      me: null,
      navigationItems: generateNavigationItems({}),
    };
  }

  componentDidMount() {
    getMeData().then((result) => {
      this.setState({ me: result.me });
      this.setState({ navigationItems: generateNavigationItems(this.state) });
    });
  }

  render() {
    return (
      <div className={s.root} role="navigation">
        {this.state.navigationItems.map((item) => {
          if (item.to) {
            return <Link className={item.className} to={item.to}>{item.label}</Link>;
          }
          return <span className={item.className}>{item.label}</span>;
        })}
      </div>
    );
  }
}

export default withStyles(s)(Navigation);
