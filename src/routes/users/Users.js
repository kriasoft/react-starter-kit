/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Row, Col, Grid, Checkbox } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import User from '../../components/User';
import s from './Users.css';

class Users extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  render() {
    const usersList = [];
    for (let i = 0; i < this.props.users.length; i += 1) {
      usersList.push(
        <li key={this.props.users[i].id}>
          <User user={this.props.users[i]} />
          {this.props.users[i].isAdmin}
        </li>,
      );
    }
    const groupsList = [];
    for (let i = 0; i < this.props.groups.length; i += 1) {
      groupsList.push(
        <li key={this.props.groups[i].id}>
          <Checkbox>{this.props.groups[i].title}</Checkbox>
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Grid>
            <Row>
              <Col md={4}>
                <h1>Groups</h1>
                <ol>{groupsList}</ol>
              </Col>
              <Col md={8}>
                <h1>{this.props.title}</h1>
                <ol>{usersList}</ol>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Users);
