/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Row, Col, Checkbox, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import User from '../../components/User';
import ModalAdd from '../../components/ModalAdd';
import s from './Users.css';
import { addGroup } from '../../actions/users';

class Users extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groups: [],
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.addGroup = this.addGroup.bind(this);
  }

  componentWillMount() {
    this.setState({
      groups: this.context.store.getState().users.groups,
    });
  }
  handleChange(event) {
    this.setState({ groupName: event.target.value });
  }

  handleOpen() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  async addGroup() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation createGroup($title: String) {
          createGroup(title: $title) { id, title } 
        }`,
        variables: {
          title: this.state.groupName,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addGroup(data.createGroup));
    this.close();
  }

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
    for (let i = 0; i < this.state.groups.length; i += 1) {
      groupsList.push(
        <li key={this.props.groups[i].id}>
          <Checkbox>{this.props.groups[i].title}</Checkbox>
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <Col md={4}>
              <h1>Groups</h1>
              <ol>{groupsList}</ol>
              <Button bsStyle="primary" onClick={() => this.handleOpen()}>
                Add Group
              </Button>
              <ModalAdd
                value={this.state.groupName}
                title="Group"
                show={this.state.showModal}
                onInputChange={this.handleChange}
                onSubmitClick={this.addGroup}
                handleClose={this.close}
              />
            </Col>
            <Col md={8}>
              <h1>{this.props.title}</h1>
              <ol>{usersList}</ol>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Users);
