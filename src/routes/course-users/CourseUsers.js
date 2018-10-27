import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col } from 'react-bootstrap';
import s from './CourseUsers.css';
import User from '../../components/User';

function CourseUsers({ course }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>Subscribed to {course.title}</h1>
        <Col xs={12} md={10}>
          <ol>
            {course.users.map(user => (
              <li key={user.id}>
                <User user={user} />
              </li>
            ))}
          </ol>
        </Col>
      </div>
    </div>
  );
}

CourseUsers.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
      }),
    ),
  }).isRequired,
};

CourseUsers.contextTypes = {
  store: PropTypes.any.isRequired,
  fetch: PropTypes.func.isRequired,
};

export default withStyles(s)(CourseUsers);
