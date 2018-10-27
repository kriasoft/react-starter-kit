import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

const User = ({ user, link }) =>
  link ? (
    <span>
      <Link to={`/users/${user.id}`}>{user.email}</Link>
      {user.isAdmin && '(admin)'}
      {user.role && ` (${user.role})`}
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
    role: PropTypes.string,
  }).isRequired,
  link: PropTypes.bool,
};

export default User;
