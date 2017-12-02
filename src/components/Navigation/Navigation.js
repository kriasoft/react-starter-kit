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
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Navigation.css';
import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Navigation extends React.Component {
  static contextTypes = { store: PropTypes.any.isRequired };

  render() {
    function processClick(a, event) {
      if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
        return;
      }
      event.preventDefault();
      history.push(event.target.getAttribute('href'));
    }

    function logout(event) {
      window.location.href = '/logout';
      event.preventDefault();
    }

    return (
      <Navbar
        inverse
        collapseOnSelect
        fixedTop
        defaultExpanded
        fluid
        onSelect={processClick}
      >
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">NDO</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem href="/courses">Курсы</NavItem>
            <NavItem href="/users">Пользователи</NavItem>
            <NavItem href="/about">About</NavItem>
            <NavItem href="/contact">Contact</NavItem>
          </Nav>
          {this.context.store.getState().user ? (
            <Nav pullRight>
              <NavItem href="/logout" onSelect={logout}>
                Log out
              </NavItem>
            </Nav>
          ) : (
            <Nav pullRight>
              <NavItem href="/login">Log in</NavItem>
              <NavItem href="/register">Sign up</NavItem>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withStyles(s)(Navigation);
