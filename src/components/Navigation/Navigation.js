/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import Link from '../Link';

class Navigation extends React.Component {
  render() {
    return (
      <Navbar inverse collapseOnSelect fixedTop defaultExpanded fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">NDO</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <li>
              <Link to="/courses">Курсы</Link>
            </li>
            <li>
              <Link to="/users">Пользователи</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </Nav>
          <Nav pullRight>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/register">Sign up</Link>
            </li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withStyles(s)(Navigation);
