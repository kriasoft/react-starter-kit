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

  async componentDidMount() {
    await this.props.fetchUsers();
  }

  render() {
    const { subscribers, users } = this.props;
    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <h4>Unubscribed</h4>
            <UsersTable>
              {() => (
                <UsersList
                  usersList={users.filter(
                    ({ id }) =>
                      !this.props.subscribers.find(user => user.id === id),
                  )}
                  onClick={id => this.props.subscribeUser(id)}
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
                  onClick={id => this.props.unsubscribeUser(id)}
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
  user: state.user,
  users: state.users,
});

export default connect(
  mapStateToProps,
  { subscribeUser, unsubscribeUser, fetchUsers },
)(CourseUsers);
