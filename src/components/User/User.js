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
    }).isRequired,
    link: PropTypes.bool,
  };

  render() {
    const userLine = `${this.props.user.email}`;
    if (this.props.link) {
      return <a href={`/users/${this.props.user.id}`}>{userLine}</a>;
    }
    return <span>{userLine})</span>;
  }
}

export default User;
