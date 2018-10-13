import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-bootstrap';
import UsersTable from '../UsersTable/UsersTable';
import UsersList from '../UsersList/UsersList';
import { subscribeUser, unsubscribeUser } from '../../actions/courses';
import { fetchUsers } from '../../actions/users';

class CourseUsers extends Component {
  static propTypes = {
    subscribeUser: PropTypes.func.isRequired,
    courseId: PropTypes.string.isRequired,
    fetchUsers: PropTypes.func.isRequired,
    unsubscribeUser: PropTypes.func.isRequired,
    subscribers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
  };

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     users: [],
  //   };
  // }

  async componentDidMount() {
    await this.props.fetchUsers();
    // this.updateUsers();
  }

  // async updateUsers() {
  // const resp = await this.context.fetch('/graphql', {
  //   body: JSON.stringify({
  //     query: `{users
  //         { id, email }
  //       }`,
  //   }),
  // });
  // const { data } = await resp.json();
  // this.setState({ users: data.users });
  // }

  // async addUserToCourse({ id, email }, role) {
  //   const { courseId } = this.props;
  //   const userRole = {
  //     id,
  //     email,
  //     role: role || 'student',
  //   };
  //   this.state.subscribers.push(userRole);
  //   await this.context.fetch('/graphql', {
  //     body: JSON.stringify({
  //       query: `mutation  subscribe($id: String!, $courseId: String!, $role: String){
  //         addUserToCourse(
  //           id: $id,
  //           courseId: $courseId
  //           role: $role
  //         )
  //           { id }
  //       }`,
  //       variables: {
  //         id,
  //         courseId,
  //         role: role || 'student',
  //       },
  //     }),
  //   });
  //   this.props.addUserToCourse(courseId, id);
  //   this.setState({
  //     subscribers: this.state.subscribers,
  //   });
  // }

  render() {
    // const { users } = this.state;
    const { subscribers, courseId, users } = this.props;
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <h4>Unubscribed</h4>
            <UsersTable>
              {() => (
                <UsersList
                  usersList={users}
                  // .filter(
                  //   ({ id }) =>
                  //     !this.state.subscribers.find(user => user.id === id),
                  // )}
                  onClick={({ id }) => this.props.subscribeUser(id, courseId)}
                  // actions={[
                  //   {
                  //     title: 'Student',
                  //     action: user => this.addUserToCourse(user),
                  //   },
                  //   { divider: true },
                  //   {
                  //     title: 'Teacher',
                  //     action: user => this.addUserToCourse(user, 'teacher'),
                  //   },
                  // ]}
                />
              )}
            </UsersTable>
          </Col>
          <Col md={6}>
            <h4>Subscribed</h4>
            <UsersTable>
              {() => (
                <UsersList
                  usersList={subscribers}
                  onClick={({ id }) => this.props.unsubscribeUser(id, courseId)}
                />
              )}
            </UsersTable>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  subscribers: state.course.users,
  courseId: state.course.id,
  user: state.user,
  users: state.users,
});

export default connect(
  mapStateToProps,
  { subscribeUser, unsubscribeUser, fetchUsers },
)(CourseUsers);
