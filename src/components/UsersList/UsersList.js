import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import User from '../User';
import Action from './Action';

class UsersList extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
    children: PropTypes.arrayOf(PropTypes.React),
    actionsTitle: PropTypes.string,
  };

  static defaultProps = {
    children: [],
    actionsTitle: '',
  };

  render() {
    const { users = [] } = this.props;
    const actionsRenderer = Action.actionsRenderer(
      this.props.children,
      this.props.actionsTitle,
    );
    return (
      <ListGroup>
        {users.map(user => (
          <ListGroupItem key={user.id} onClick={() => this.props.onClick(user)}>
            <User user={user} link={false} />
            {actionsRenderer(user)}
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

UsersList.Action = Action;

export default UsersList;
