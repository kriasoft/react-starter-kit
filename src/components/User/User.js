import React from 'react';
import PropTypes from 'prop-types';

const User = ({ user, link }) =>
  link ? (
    <span>
      <a href={`/users/${user.id}`}>{user.email}</a>
      {user.isAdmin ? ' (admin)' : ''}
    </span>
  ) : (
    <span>{user.email}</span>
  );

User.defaultProps = {
  link: true,
};

User.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool,
  }).isRequired,
  link: PropTypes.bool,
};

export default User;
