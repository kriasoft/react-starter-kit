import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
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
  updateGroup,
} from '../../actions/groups';
import UsersList from '../../components/UsersList';
import ModalWithUsers from '../../components/ModalWithUsers';

class Users extends React.Component {
  static propTypes = {
    addGroup: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.deleteUserFromGroup = this.deleteUserFromGroup.bind(this);
    this.addUserToGroup = this.addUserToGroup.bind(this);
  }

  getUsersOfGroup = async id => {
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
  };

  getUserGroupIds(user) {
    return {
      id: user.id,
      groupId: this.props.group.id,
    };
  }

  async openUserGroupEditor(g) {
    this.context.store.dispatch(setGroup(g));
  }

  async deleteUserFromGroup(user) {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  deleteUserFromGroup($id: String, $groupId: String) {
          deleteUserFromGroup(id: $id, groupId: $groupId) { id }
        }`,
        variables: this.getUserGroupIds(user),
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
        variables: this.getUserGroupIds(user),
      }),
    });
    this.context.store.dispatch(addUserToGroup(this.props.group.id, user));
    this.close();
  }

  addGroup = async title => {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation createGroup($title: String!) {
          createGroup(title: $title) { id, title }
        }`,
        variables: {
          title,
        },
      }),
    });
    const { data } = await resp.json();
    this.props.addGroup(data.createGroup);
  };

  updateGroup = async (id, title) => {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation updateGroup($id: String!, $title: String!) {
          updateGroup(id: $id, title: $title) { id, title }
        }`,
        variables: {
          id,
          title,
        },
      }),
    });
    this.context.store.dispatch(updateGroup(id, title));
  };

  render() {
    const { groups, users, group } = this.props;
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

    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <Col md={4}>
              <h1>
                Groups{' '}
                <ModalAdd buttonText="Add Group" onUpdate={this.addGroup} />
              </h1>
              <ol>
                {groups.map(({ id, title }) => (
                  <ul key={id}>
                    <p>{title} </p>
                    <ModalWithUsers
                      usersLeft={subscribedUsersList}
                      usersRight={mainUsersList}
                    />
                    <ModalAdd
                      title={title}
                      onUpdate={this.updateGroup.bind(this, id)} // eslint-disable-line
                    />
                  </ul>
                ))}
              </ol>
            </Col>
            <Col md={8}>
              <h1>{this.props.title}</h1>
              <ol>
                {users.map(user => (
                  <li key={user.id}>
                    <User user={user} />
                  </li>
                ))}
              </ol>
            </Col>
          </Row>
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

export default connect(
  mapStateToProps,
  { addUserToGroup, deleteUserFromGroup, addGroup },
)(withStyles(s)(Users));
