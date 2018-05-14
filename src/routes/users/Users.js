/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import User from '../../components/User';
import ModalAdd from '../../components/ModalAdd';
import s from './Users.css';
import {
  addUserToGroup,
  setGroup,
  deleteUserFromGroup,
  addGroup,
} from '../../actions/groups';
import UsersList from '../../components/UsersList';
import ModalWithUsers from '../../components/ModalWithUsers/ModalWithUsers';

class Users extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      showModal: false,
      showModalSubscribe: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.closeModalSubscribe = this.closeModalSubscribe.bind(this);
    this.getUsersOfGroup = this.getUsersOfGroup.bind(this);
    this.openUserGroupEditor = this.openUserGroupEditor.bind(this);
    this.deleteUserFromGroup = this.deleteUserFromGroup.bind(this);
    this.addUserToGroup = this.addUserToGroup.bind(this);
  }

  async getUsersOfGroup(id) {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `query groups($id: [String]) {
          groups(ids: $id) { users {id,email}} 
        }`,
        variables: { id },
      }),
    });
    const { data } = await resp.json();
    // if (!data && !data.users) throw new Error('Failed to load user profile.');
    return data.groups[0].users;
    // this.context.store.dispatch(addGroup(data.createGroup));
  }

  async openUserGroupEditor(g) {
    this.context.store.dispatch(setGroup(g));
    this.setState({
      showModalSubscribe: true,
    });
  }

  async deleteUserFromGroup(user) {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  deleteUserFromGroup($id: String, $groupId: String){
          deleteUserFromGroup (
            id: $id,
            groupId: $groupId)
            { id }
        }`,
        variables: {
          id: user.id,
          groupId: this.props.group.id,
        },
      }),
    });
    this.context.store.dispatch(deleteUserFromGroup(this.props.group.id, user));
  }

  async addUserToGroup(user) {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation addUserToGroup($id:String, $groupId: String) {
          addUserToGroup(id: $id, groupId: $groupId) { id } 
        }`,
        variables: {
          id: user.id,
          groupId: this.props.group.id,
        },
      }),
    });
    this.context.store.dispatch(addUserToGroup(this.props.group.id, user));
    this.close();
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
          createGroup(title: $title) { id, title, users{ id} } 
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

  closeModalSubscribe() {
    this.setState({ showModalSubscribe: false });
  }

  render() {
    const { groups, group } = this.props;
    let usersSub = [];
    let usersSubId = [];
    if (Object.keys(group).length !== 0) {
      usersSub = groups.find(_group => _group.id === group.id).users;
      usersSubId = usersSub.map(u => u.id);
    }

    const unsubscribeUsers = this.props.users.filter(
      el => !usersSubId.includes(el.id),
    );
    const subscribedUsersList = (
      <UsersList
        usersList={usersSub}
        onClick={user => this.deleteUserFromGroup(user)}
      />
    );
    const mainUsersList = (
      <UsersList
        usersList={unsubscribeUsers}
        onClick={user => this.addUserToGroup(user)}
      />
    );
    const usersList = [];
    for (let i = 0; i < this.props.users.length; i += 1) {
      usersList.push(
        <li key={this.props.users[i].id}>
          <User user={this.props.users[i]} />
          {this.props.users[i].isAdmin}
        </li>,
      );
    }
    const groupsList = groups.map(g => (
      <ul key={g.id}>
        <Row>
          <Col md={6}>
            <p>{g.title} </p>
          </Col>
          <Col md={4}>
            <Button onClick={() => this.openUserGroupEditor(g)}>
              <Glyphicon glyph="pencil" />
            </Button>
          </Col>
        </Row>
      </ul>
    ));

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
          <ModalWithUsers
            show={this.state.showModalSubscribe}
            titleLeft="Subscribed"
            usersLeft={subscribedUsersList}
            titleRight="Unsubscribed"
            usersRight={mainUsersList}
            handleClose={this.closeModalSubscribe}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.groups.groups,
  users: state.users,
  group: state.groups.group,
});

export default connect(mapStateToProps)(withStyles(s)(Users));
