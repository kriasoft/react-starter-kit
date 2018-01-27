import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import User from '../../components/User';

class UsersList extends React.Component {
  static propTypes = {
    usersList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
      }),
    ).isRequired,
    onClick: PropTypes.func.isRequired,
  };
  render() {
    const { usersList, onClick } = this.props;
    return usersList.map(user => (
      <tr key={user.id}>
        <td>
          <Button bsStyle="primary" role="link" onClick={() => onClick(user)}>
            <User user={user} link={false} />
          </Button>
        </td>
      </tr>
    ));
  }
}

export default UsersList;
