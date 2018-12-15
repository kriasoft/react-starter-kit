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
import { addGroup, updateGroup } from '../../actions/groups';
import createGroup from '../../gql/createGroup.gql';
import updateGroupMutation from '../../gql/updateGroup.gql';
import UsersList from '../../components/UsersList';

class ModalGroupEdit extends React.Component {
  static propTypes = {
    modalId: PropTypes.string.isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    edit: PropTypes.bool,
    modals: PropTypes.shape({}).isRequired,
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

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

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

  render() {
    const { modalId, modals, edit } = this.props;
    const group = modals[`${modalId}_data`] || {};
    const { title = group.title } = this.state;
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
                  <UsersList
                    users={this.props.users}
                    onClick={user => alert(user.id)}
                  />
                </Col>
                <Col md={6}>
                  <UsersList
                    users={this.props.users}
                    onClick={user => alert(user.id)}
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

// TODO: find how not use modals value here (it's too internal)
const mapStateToProps = state => ({
  modals: state.modals,
  course: state.course,
  users: state.users,
});

export default connect(mapStateToProps)(ModalGroupEdit);
