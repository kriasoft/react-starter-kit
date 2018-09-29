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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col } from 'react-bootstrap';
import s from './CourseUsers.css';

class CourseUsers extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  render() {
    const { users } = this.props.course;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>Subscribed to {this.props.course.title}</h1>
          <Col xs={12} md={10}>
            <ol>
              {users.map(user => (
                <li key={user.id}>
                  <a href={`/users/${user.id}`}>{user.email}</a> (
                  {user.role})
                </li>
              ))}
            </ol>
          </Col>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CourseUsers);
