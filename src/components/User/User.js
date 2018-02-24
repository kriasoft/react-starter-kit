import React from 'react';
import PropTypes from 'prop-types';

class User extends React.Component {
  static defaultProps = {
    link: true,
  };

  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      isAdmin: PropTypes.bool,
    }).isRequired,
    link: PropTypes.bool,
  };

  render() {
    const { user } = this.props;
    const userLine = `${this.props.user.email}`;
    if (this.props.link) {
      return (
        <span>
          <a href={`/users/${user.id}`}>{userLine}</a>{' '}
          {user.isAdmin ? '(admin)' : ''}
        </span>
      );
    }
    return <span>{userLine}</span>;
  }
}

export default User;
