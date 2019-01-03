import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';

const User = ({ user, link }) => {
  const tags = [];
  if (!user) tags.push('robot');
  if (user && user.isAdmin) tags.push('admin');
  if (user && user.role) tags.push(user.role);
  const tagsView = (tags.length && <b>[{tags.join(', ')}]</b>) || null;
  return user && link ? (
    <span>
      <Link to={`/users/${user.id}`}>{user.email}</Link>
      {tagsView}
    </span>
  ) : (
    <span>
      {(user && user.email) || ''}
      {tagsView}
    </span>
  );
};

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
