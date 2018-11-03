import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './CourseUsers.css';
import User from '../../components/User';
import ModalWithUsers from '../../components/ModalWithUsers';
import IconButton from '../../components/IconButton';

function CourseUsers({ course: { title, users } }) {
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>
          {`Subscribed to ${title}:`}
          <ModalWithUsers
            toggleButton={onToggle => (
              <IconButton onClick={onToggle} glyph="plus" />
            )}
          />
        </h1>
        <ol>
          {users.map(user => (
            <li key={user.id}>
              <User user={user} />
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
};

const mapStateToProps = state => ({
  course: state.course,
});

export default connect(mapStateToProps)(withStyles(s)(CourseUsers));
