import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, SplitButton, MenuItem } from 'react-bootstrap';
import User from '../../components/User';

class UsersList extends React.Component {
  static propTypes = {
    usersList: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
    onClick: PropTypes.func.isRequired,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        action: PropTypes.func,
      }),
    ),
  };

  static defaultProps = {
    actions: [],
  };

  static renderActions(user, actions) {
    return actions.map((item, i) => {
      const attrs = {};
      if (item.action) attrs.onClick = () => item.action(user);
      attrs.eventKey = i;
      if (item.divider) attrs.divider = true;
      return <MenuItem {...attrs}>{item.title}</MenuItem>;
    });
  }

  render() {
    const { usersList, onClick, actions } = this.props;
    const users = usersList.map(user => (
      <tr key={user.id}>
        <td>
          {actions.length ? (
            <SplitButton
              onClick={() => onClick(user)}
              bsStyle="default"
              title={user.email + (user.isAdmin ? ' (a)' : '')}
            >
              {UsersList.renderActions(user, actions)}
            </SplitButton>
          ) : (
            <Button bsStyle="primary" role="link" onClick={() => onClick(user)}>
              <User user={user} link={false} />
            </Button>
          )}
          {user.role ? ` [${user.role}]` : ''}
        </td>
      </tr>
    ));
    return <Fragment>{users}</Fragment>;
  }
}

export default UsersList;
