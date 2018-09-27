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
import UnitsList from '../../components/UnitsList';
import UsersList from '../../components/UsersList';
import s from './Course.css';
import { addUnit } from '../../actions/units';
import { addUserToCourse, deleteUserFromCourse } from '../../actions/courses';
import ModalWithUsers from '../../components/ModalWithUsers/ModalWithUsers';
import IconButton from '../../components/IconButton/IconButton';
import ModalAdd from '../../components/ModalAdd';

class Course extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    addUserToCourse: PropTypes.func.isRequired,
    addUnit: PropTypes.func.isRequired,
    deleteUserFromCourse: PropTypes.func.isRequired,
    units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
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
      unitBody: '',
      showModalEditor: false,
      showModalSubscribe: false,
      unitName: '',
      subscribedUsersList: [],
      showModalAdd: false,
      courseName: props.title,
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addUnit = this.addUnit.bind(this);
  }

  componentWillMount() {
    this.setState({
      subscribedUsersList: this.props.users,
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
    this.setState({ unitName: event.target.value });
  }

  handleChangeBody(val) {
    this.setState({ unitBody: val });
  }

  closeModalUnit = () => {
    this.setState({ showModalEditor: false });
  };
  closeModalAdd = () => {
    this.setState({ showModalAdd: false });
  };
  async addUserToCourse(user, role) {
    const { id } = this.props;
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
          courseId: id,
          role: role || 'student',
        },
      }),
    });
    this.props.addUserToCourse(id, user.id);
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
          courseId: this.props.id,
        },
      }),
    });
    const { data } = await resp.json();
    this.props.deleteUserFromCourse(data.deleteUserFromCourse);

    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async addUnit() {
    const { id } = this.props;
    const { unitName, unitBody } = this.state;
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($courseId: String, $title: String, $body: String){
          createUnit(
            title: $title,
            courseId: $courseId,
            body: $body)
          { id, title }
        }`,
        variables: {
          title: unitName,
          courseId: id,
          body: unitBody,
        },
      }),
    });
    this.props.addUnit(id, unitName);
    this.closeModalUnit();
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

    const { user, units, title, id } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {title}
            {user && (
              <IconButton
                onClick={() => {
                  this.setState({ showModalEditor: true });
                }}
                glyph="plus"
              />
            )}
            {user && (
              <IconButton
                onClick={() => {
                  this.setState({ showModalAdd: true });
                }}
                glyph="pencil"
              />
            )}
          </h1>
          <UnitsList units={units} courseId={id} />
          <ModalEditor
            title="Unit"
            show={this.state.showModalEditor}
            unitName={this.state.unitName}
            unitBody={this.state.unitBody}
            onInputChange={this.handleChange}
            onEditorChange={this.handleChangeBody}
            onSubmitClick={this.addUnit}
            handleClose={this.closeModalUnit}
          />
          <ModalAdd
            value={this.state.courseName}
            title="Course"
            show={this.state.showModalAdd}
            onInputChange={e => this.setState({ courseName: e.target.value })}
            // onSubmitClick={() => {
            // onSubmitClick(courseName);
            // this.close();
            // }}
            handleClose={this.closeModalAdd}
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
            usersLeft={subscribedUsersList}
            usersRight={usersList}
            handleClose={() => this.setState({ showModalSubscribe: false })}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  units: state.course.units,
  user: state.user,
});

export default connect(
  mapStateToProps,
  { addUserToCourse, deleteUserFromCourse, addUnit },
)(withStyles(s)(Course));
