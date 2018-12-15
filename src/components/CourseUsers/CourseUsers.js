import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-bootstrap';
import { subscribeUser, unsubscribeUser } from '../../actions/courses';
import { fetchUsers } from '../../actions/users';
import UsersList from '../UsersList';

class CourseUsers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    const { dispatch } = this.props;
    await dispatch(fetchUsers());
  }

  render() {
    const { subscribers, users, dispatch } = this.props;
    const unsubscribed = users.filter(
      ({ id }) => !subscribers.find(user => user.id === id),
    );

    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <h2>Unsubscribed</h2>
            <UsersList
              users={unsubscribed}
              onClick={user => dispatch(subscribeUser(user.id))}
              actionsTitle="Role"
            >
              <UsersList.Action
                onClick={user => dispatch(subscribeUser(user.id))}
              >
                Student
              </UsersList.Action>
              <UsersList.Action
                onClick={user => dispatch(subscribeUser(user.id, 'teacher'))}
              >
                Teacher
              </UsersList.Action>
            </UsersList>
          </Col>
          <Col md={6}>
            <h2>Subscribed</h2>
            <UsersList
              users={subscribers}
              onClick={user => dispatch(unsubscribeUser(user.id))}
            />
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

export default connect(mapStateToProps)(CourseUsers);
