import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FormControl,
  ControlLabel,
  FormGroup,
  HelpBlock,
  Col,
  Row,
} from 'react-bootstrap';
import Modal from '../../components/Modal';
import {
  addGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
} from '../../actions/groups';
import createGroup from '../../gql/createGroup.gql';
import updateGroupMutation from '../../gql/updateGroup.gql';
import UsersList from '../../components/UsersList';
import deleteUserFromGroupMutation from '../../gql/deleteUserFromGroup.gql';
import addUserToGroupMutation from '../../gql/addUserToGroup.gql';

class ModalGroupEdit extends React.Component {
  static propTypes = {
    modalId: PropTypes.string.isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    edit: PropTypes.bool,
    users: PropTypes.arrayOf({}).isRequired,
  };

  static defaultProps = {
    edit: true,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  state = {};

  getUserGroupIds(user) {
    return {
      id: user.id,
      groupId: this.props.group.id,
    };
  }

  addGroup = async ({ title }) => {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: createGroup,
        variables: {
          title,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addGroup(data.createGroup));
  };

  updateGroup = async ({ id, title }) => {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: updateGroupMutation,
        variables: {
          id,
          title,
        },
      }),
    });
    this.context.store.dispatch(updateGroup({ id, title }));
  };

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
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { group, edit, users } = this.props;
    const { title = group.title } = this.state;
    const groupUsers = group.users || [];
    return (
      <Modal
        modalId={this.props.modalId}
        defaultFooter={edit ? 'save_close' : 'add_close'}
        onSubmit={() =>
          edit
            ? this.updateGroup({ title, id: group.id })
            : this.addGroup({ title })
        }
      >
        <Modal.Body>
          <FormGroup controlId="title">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              autoFocus
              type="text"
              value={title}
              name="title"
              onChange={this.handleChange}
            />
            <HelpBlock>Title can not be empty</HelpBlock>
          </FormGroup>
          {edit && (
            <FormGroup>
              <Row>
                <Col md={6}>
                  <h2>Users</h2>
                  <UsersList
                    users={users.filter(
                      u1 => !groupUsers.find(u2 => u2.id === u1.id),
                    )}
                    onClick={user => this.addUserToGroup(user)}
                  />
                </Col>
                <Col md={6}>
                  <h2>Group users</h2>
                  <UsersList
                    users={groupUsers}
                    onClick={user => this.deleteUserFromGroup(user)}
                  />
                </Col>
              </Row>
            </FormGroup>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  course: state.course,
  users: state.users,
  group: state.group || {},
});

export default connect(mapStateToProps)(ModalGroupEdit);
