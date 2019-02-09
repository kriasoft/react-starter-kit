import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './CourseUsers.css';
import User from '../../components/User';
import ModalWithUsers from '../../components/ModalWithUsers';
import IconButton from '../../components/IconButton';
import { getRole } from '../../util/course';

function CourseUsers({ course = {}, user }) {
  const { title, users } = course;
  const role = getRole(course, user);
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>
          {`Subscribed to ${title}`}
          {((user && user.isAdmin) || role === 'teacher') && (
            <ModalWithUsers
              toggleButton={onToggle => (
                <IconButton onClick={onToggle} glyph="pencil" />
              )}
            />
          )}
        </h1>
        <ol>
          {users.map(u => (
            <li key={u.id}>
              <User user={u} />
            </li>
          ))}
        </ol>
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
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => ({
  course: state.course,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(s)(CourseUsers));
