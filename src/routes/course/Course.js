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
import { Button } from 'react-bootstrap';
import ModalSubscribe from '../../components/ModalSubscribe';
import ModalEditor from '../../components/ModalEditor';
import StudyEntitiesList from '../../components/StudyEntitiesList';
import UsersList from '../../components/UsersList';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study_entities';
import { addUserToCourse, deleteUserFromCourse } from '../../actions/courses';

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
          role: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      studyEntityBody: '',
      showModalEditor: false,
      showModalSubscribe: false,
      studyEntityName: '',
      studyEntities: [],
      subscribedUsersList: [],
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addStudyEntity = this.addStudyEntity.bind(this);
    this.closeModalStudyEntity = this.closeModalStudyEntity.bind(this);
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
    this.setState({ showModalEditor: false });
  }

  closeModalSubscribe() {
    this.setState({ showModalSubscribe: false });
  }

  async addUserToCourse(user, role) {
    const userRole = {
      id: user.id,
      email: user.email,
      role: role || 'student',
    };
    this.state.subscribedUsersList.push(userRole);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  subscribe($id: String, $courseId: String, $role: String){
          addUserToCourse(
            id: $id,
            courseId: $courseId
            role: $role
          )
            { id }
        }`,
        variables: {
          id: user.id,
          courseId: this.props.course.id,
          role: role || 'student',
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addUserToCourse(data.addUserToCourse));
    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async deleteUserFromCourse(user) {
    const i = this.state.subscribedUsersList.indexOf(user);
    this.state.subscribedUsersList.splice(i, 1);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  unsubscribe($id: String, $courseId: String){
          deleteUserFromCourse (
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
    this.context.store.dispatch(
      deleteUserFromCourse(data.deleteUserFromCourse),
    );

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
        onClick={user => this.addUserToCourse(user)}
        actions={[
          { title: 'Student', action: user => this.addUserToCourse(user) },
          { divider: true },
          {
            title: 'Teacher',
            action: user => this.addUserToCourse(user, 'teacher'),
          },
        ]}
      />
    );

    const subscribedUsersList = (
      <UsersList
        usersList={this.state.subscribedUsersList}
        onClick={user => this.deleteUserFromCourse(user)}
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
        <Button
          bsStyle="primary"
          onClick={() => {
            this.setState({ showModalEditor: true });
          }}
        >
          Add study entity
        </Button>
        <ModalEditor
          title="Study entity"
          show={this.state.showModalEditor}
          studyEntityName={this.state.studyEntityName}
          studyEntityBody={this.state.studyEntityBody}
          onInputChange={this.handleChange}
          onEditorChange={this.handleChangeBody}
          onSubmitClick={this.addStudyEntity}
          handleClose={this.closeModalStudyEntity}
        />
        <Button
          bsStyle="primary"
          onClick={() => {
            this.setState({ showModalSubscribe: true });
          }}
        >
          Subscribe user
        </Button>
        <ModalSubscribe
          show={this.state.showModalSubscribe}
          subscribedUsers={subscribedUsersList}
          unsubscribedUsers={usersList}
          handleClose={this.closeModalSubscribe}
        />
      </div>
    );
  }
}

export default withStyles(s)(Course);
