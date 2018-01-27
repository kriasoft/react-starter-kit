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
import {
  Modal,
  Button,
  FormControl,
  Table,
  ButtonToolbar,
} from 'react-bootstrap';
import TextEditor from '../../components/TextEditor';
import User from '../../components/User';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study_entities';
import { subscribeUser, unsubscribeUser } from '../../actions/courses';

const StudyEntitiesList = ({ studyEntities, course }) => (
  <ol>
    {studyEntities.map(se => (
      <li key={se.id}>
        <a href={`/courses/${course.id}/${se.id}`}>{se.title}</a>
      </li>
    ))}
  </ol>
);

StudyEntitiesList.propTypes = {
  studyEntities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    studyEntities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
  }).isRequired,
};

const UsersList = ({ usersList, onClick }) =>
  usersList.map(user => (
    <tr key={user.id}>
      <td>
        <Button bsStyle="primary" role="link" onClick={() => onClick(user)}>
          <User user={user} link={false} />
        </Button>
      </td>
    </tr>
  ));

const ModalSubscribe = ({
  isShowed,
  onCloseClick,
  subscribedUsers,
  unsubscribedUsers,
}) => (
  <Modal show={isShowed} onHide={onCloseClick}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="row">
        <div className="col-md-6">
          <h4>Subscribed</h4>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>User email</th>
              </tr>
            </thead>
            <tbody>{subscribedUsers}</tbody>
          </Table>
        </div>
        <div className="col-md-6">
          <h4>Unsubscribed</h4>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>User email</th>
              </tr>
            </thead>
            <tbody>{unsubscribedUsers}</tbody>
          </Table>
        </div>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onCloseClick}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ModalSubscribe.propTypes = {
  isShowed: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func.isRequired,
  subscribedUsers: PropTypes.element.isRequired,
  unsubscribedUsers: PropTypes.element.isRequired,
};

const ModalStudyEntity = ({
  isShowed,
  state,
  onInputChange,
  onEditorChange,
  onSubmitClick,
  onCloseClick,
}) => (
  <Modal show={isShowed} onHide={onCloseClick}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <h4>Course name</h4>
      <FormControl
        type="text"
        value={state.studyEntityName}
        onChange={onInputChange}
      />
      <div>
        <br />
        <TextEditor value={state.studyEntityBody} onChange={onEditorChange} />
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={onSubmitClick}>Add study entity</Button>
      <Button onClick={onCloseClick}>Close</Button>
    </Modal.Footer>
  </Modal>
);

ModalStudyEntity.propTypes = {
  isShowed: PropTypes.bool.isRequired,
  state: PropTypes.shape({ studyEntityName: PropTypes.string.isRequired })
    .isRequired,
  onInputChange: PropTypes.func.isRequired,
  onEditorChange: PropTypes.func.isRequired,
  onSubmitClick: PropTypes.func.isRequired,
  onCloseClick: PropTypes.func.isRequired,
};

class Course extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      studyEntities: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
        }),
      ),
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          email: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      studyEntityBody: '',
      showModal: false,
      showModalSubscribe: false,
      studyEntityName: '',
      studyEntities: [],
      subscribedUsersList: [],
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addStudyEntity = this.addStudyEntity.bind(this);
    this.openModalStudyEntity = this.openModalStudyEntity.bind(this);
    this.closeModalStudyEntity = this.closeModalStudyEntity.bind(this);
    this.openModalSubscribe = this.openModalSubscribe.bind(this);
    this.closeModalSubscribe = this.closeModalSubscribe.bind(this);
  }

  componentWillMount() {
    this.setState({
      studyEntities: this.context.store.getState().course.studyEntities,
      subscribedUsersList: this.props.course.users,
    });
  }

  componentDidMount() {
    this.context.store.subscribe(() => {
      this.setState({
        studyEntities: this.context.store.getState().course.studyEntities,
      });
    });
    this.updateUsers();
  }

  async updateUsers() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `{users
          { id, email }
        }`,
      }),
    });
    const { data } = await resp.json();
    this.setState({ users: data.users });
  }

  handleChange(event) {
    this.setState({ studyEntityName: event.target.value });
  }

  handleChangeBody(val) {
    this.setState({ studyEntityBody: val });
  }

  closeModalStudyEntity() {
    this.setState({ showModal: false });
  }

  openModalStudyEntity() {
    this.setState({ showModal: true });
  }

  closeModalSubscribe() {
    this.setState({ showModalSubscribe: false });
  }

  openModalSubscribe() {
    this.setState({ showModalSubscribe: true });
  }

  async subscribeUser(user) {
    this.state.subscribedUsersList.push(user);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  subscribe($id: String, $courseId: String){
          subscribeUser(
            id: $id,
            courseId: $courseId)
            { id }
        }`,
        variables: {
          id: user.id,
          courseId: this.props.course.id,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(subscribeUser(data.subscribeUser));
    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async unsubscribeUser(user) {
    const i = this.state.subscribedUsersList.indexOf(user);
    this.state.subscribedUsersList.splice(i, 1);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  unsubscribe($id: String, $courseId: String){
          unsubscribeUser(
            id: $id,
            courseId: $courseId)
            { id }
        }`,
        variables: {
          id: user.id,
          courseId: this.props.course.id,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(unsubscribeUser(data.unsubscribeUser));

    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async addStudyEntity() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($courseId: String, $title: String, $body: String){ 
          createStudyEntity(
            title: $title,
            courseId: $courseId,
            body: $body)
          { id, title }
        }`,
        variables: {
          title: this.state.studyEntityName,
          courseId: this.props.course.id,
          body: this.state.studyEntityBody,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addStudyEntity(data.createStudyEntity));
    this.closeModalStudyEntity();
  }

  render() {
    const usersListArray = (this.state.users || []).filter(
      u => !this.state.subscribedUsersList.find(user => user.id === u.id),
    );

    const usersList = (
      <UsersList
        usersList={usersListArray}
        onClick={user => this.subscribeUser(user)}
      />
    );

    const subscribedUsersList = (
      <UsersList
        usersList={this.state.subscribedUsersList}
        onClick={user => this.unsubscribeUser(user)}
      />
    );

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <StudyEntitiesList
            studyEntities={this.state.studyEntities}
            course={this.props.course}
          />
        </div>
        <ButtonToolbar>
          <Button bsStyle="primary" onClick={this.openModalStudyEntity}>
            Add study entity
          </Button>
          <Button bsStyle="primary" onClick={this.openModalSubscribe}>
            Subscribe user
          </Button>
        </ButtonToolbar>
        <ModalStudyEntity
          isShowed={this.state.showModal}
          state={this.state}
          onInputChange={this.handleChange}
          onEditorChange={this.handleChangeBody}
          onSubmitClick={this.addStudyEntity}
          onCloseClick={this.closeModalStudyEntity}
        />
        <ModalSubscribe
          isShowed={this.state.showModalSubscribe}
          subscribedUsers={subscribedUsersList}
          unsubscribedUsers={usersList}
          onCloseClick={this.closeModalSubscribe}
        />
      </div>
    );
  }
}

export default withStyles(s)(Course);
