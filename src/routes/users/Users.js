import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import User from '../../components/User';
import s from './Users.css';
import {
  addUserToGroup,
  setGroup,
  deleteUserFromGroup,
  addGroup,
} from '../../actions/groups';
// import UsersList from '../../components/UsersList';
import ModalWithUsers from '../../components/ModalWithUsers';
import IconButton from '../../components/IconButton';
import groupUsers from '../../gql/groupUsers.gql';
import deleteUserFromGroupMutation from '../../gql/deleteUserFromGroup.gql';
import addUserToGroupMutation from '../../gql/addUserToGroup.gql';
import ModalGroupEdit from '../../components/ModalGroupEdit';
import { showModal } from '../../actions/modals';

class Users extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
      isAdmin: PropTypes.bool,
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
        query: groupUsers,
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
        query: deleteUserFromGroupMutation,
        variables: this.getUserGroupIds(user),
      }),
    });
    this.context.store.dispatch(deleteUserFromGroup(this.props.group.id, user));
  }

  async addUserToGroup(user) {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: addUserToGroupMutation,
        variables: this.getUserGroupIds(user),
      }),
    });
    this.context.store.dispatch(addUserToGroup(this.props.group.id, user));
    this.close();
  }

  render() {
    const {
      groups,
      users,
      // group
      user = {},
    } = this.props;
    const { dispatch } = this.context.store;
    // let usersSub = [];
    // let usersSubId = [];
    // if (Object.keys(group).length !== 0) {
    // usersSub = groups.find(_group => _group.id === group.id).users;
    // usersSubId = usersSub.map(u => u.id);
    // }

    // const unsubscribeUsers = this.props.users.filter(
    //   el => !usersSubId.includes(el.id),
    // );
    // const subscribedUsersList = (
    //   <UsersList
    //     usersList={usersSub}
    //     onClick={user => this.deleteUserFromGroup(user)}
    //   />
    // );
    // const mainUsersList = (
    //   <UsersList
    //     usersList={unsubscribeUsers}
    //     onClick={user => this.addUserToGroup(user)}
    //   />
    // );

    return (
      <div className={s.root}>
        <ModalGroupEdit modalId="modalGroupAdd" edit={false} />
        <ModalGroupEdit modalId="modalGroupEdit" />
        <div className={s.container}>
          <Row>
            <Col md={4}>
              <h1>
                Groups{' '}
                {user.isAdmin && (
                  <IconButton
                    onClick={() => dispatch(showModal('modalGroupAdd'))}
                    glyph="plus"
                  />
                )}
              </h1>
              <ol>
                {groups.map(({ id, title }) => (
                  <ul key={id}>
                    <p>{title} </p>
                    <ModalWithUsers
                      toggleButton={onToggle => (
                        <IconButton onClick={onToggle} glyph="plus" />
                      )}
                    />
                    {user.isAdmin && (
                      <IconButton
                        onClick={() =>
                          dispatch(showModal('modalGroupEdit', { id, title }))
                        }
                        glyph="pencil"
                      />
                    )}
                  </ul>
                ))}
              </ol>
            </Col>
            <Col md={8}>
              <h1>{this.props.title}</h1>
              <ol>
                {users.map(u => (
                  <li key={u.id}>
                    <User user={u} />
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
  user: state.user,
  groups: state.groups.groups,
  users: state.users,
  group: state.groups.group,
});

export default connect(
  mapStateToProps,
  { addUserToGroup, deleteUserFromGroup, addGroup },
)(withStyles(s)(Users));
