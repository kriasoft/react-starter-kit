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
import { connect } from 'react-redux';
import ModalEditor from '../../components/ModalEditor';
import StudyEntitiesList from '../../components/StudyEntitiesList';
import UsersList from '../../components/UsersList';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study-entities';
import { addUserToCourse, deleteUserFromCourse } from '../../actions/courses';
import ModalWithUsers from '../../components/ModalWithUsers/ModalWithUsers';
import IconButton from '../../components/IconButton/IconButton';

class Course extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    addUserToCourse: PropTypes.func.isRequired,
    addStudyEntity: PropTypes.func.isRequired,
    deleteUserFromCourse: PropTypes.func.isRequired,
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
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          email: PropTypes.string,
          role: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      studyEntityBody: '',
      showModalEditor: false,
      showModalSubscribe: false,
      studyEntityName: '',
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
      subscribedUsersList: this.props.course.users,
    });
  }

  componentDidMount() {
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
    const { course } = this.props;
    const userRole = {
      id: user.id,
      email: user.email,
      role: role || 'student',
    };
    this.state.subscribedUsersList.push(userRole);
    await this.context.fetch('/graphql', {
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
          courseId: course.id,
          role: role || 'student',
        },
      }),
    });
    this.props.addUserToCourse(course.id, user.id);
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
    this.props.deleteUserFromCourse(data.deleteUserFromCourse);

    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async addStudyEntity() {
    const { course } = this.props;
    const { studyEntityName, studyEntityBody } = this.state;
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($courseId: String, $title: String, $body: String){ 
          createStudyEntity(
            title: $title,
            courseId: $courseId,
            body: $body)
          { id, title }
        }`,
        variables: {
          title: studyEntityName,
          courseId: course.id,
          body: studyEntityBody,
        },
      }),
    });
    this.props.addStudyEntity(course.id, studyEntityName);
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

    const { user, studyEntities, course } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {course.title}
            {user && (
              <IconButton
                onClick={() => {
                  this.setState({ showModalEditor: true });
                }}
                glyph="plus"
              />
            )}
          </h1>
          <StudyEntitiesList studyEntities={studyEntities} course={course} />
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
          <ModalWithUsers
            show={this.state.showModalSubscribe}
            titleLeft="Subscribed"
            usersLeft={subscribedUsersList}
            titleRight="Unsubscribed"
            usersRight={usersList}
            handleClose={this.closeModalSubscribe}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  studyEntities: state.course.studyEntities,
  user: state.user,
});

export default connect(
  mapStateToProps,
  { addUserToCourse, deleteUserFromCourse, addStudyEntity },
)(withStyles(s)(Course));
