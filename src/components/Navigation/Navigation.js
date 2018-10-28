import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import Link from '../Link';
import history from '../../history';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

function processClick(a, event) {
  if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
    return;
  }
  event.preventDefault();
  history.push(event.target.getAttribute('href'));
}

function logout() {
  window.location.href = '/logout';
}

class Navigation extends React.Component {
  static contextTypes = { store: PropTypes.any.isRequired };

  render() {
    const { store } = this.context;
    const { user } = store.getState();
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
            <Link to="/">NDO</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="/courses">
              Courses
            </NavItem>
            <NavItem eventKey={2} href="/users">
              Users
            </NavItem>
            <NavItem eventKey={3} href="/files">
              Files
            </NavItem>
            <NavItem eventKey={4} href="/tests">
              Tests
            </NavItem>
          </Nav>
          {user ? (
            <Nav pullRight>
              <NavItem eventKey={1} href={`/users/${user.id}`}>
                {user.email}
              </NavItem>
              <NavItem eventKey={2} onSelect={logout}>
                Log out
              </NavItem>
            </Nav>
          ) : (
            <Nav pullRight>
              <NavItem eventKey={1} href="/login">
                Log in
              </NavItem>
              <NavItem eventKey={2} href="/register">
                Sign up
              </NavItem>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default Navigation;
