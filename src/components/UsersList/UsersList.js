import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap';
import User from '../User';

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

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     input: '',
  //   };
  // }

  // onInputChange = e => {
  //   this.setState({ input: e.target.value });
  // };

  static renderActions(user, actions) {
    return actions.map((item, i) => {
      const attrs = {};
      if (item.action) attrs.onClick = () => item.action(user);
      attrs.eventKey = i;
      if (item.divider) attrs.divider = true;
      return (
        <MenuItem key={attrs.eventKey} {...attrs}>
          {item.title}
        </MenuItem>
      );
    });
  }

  render() {
    const { usersList, onClick, actions } = this.props;
    // const { input } = this.state;
    const users = usersList
      // .filter(({ email }) => email.includes(`${input}`))
      .map(user => (
        <tr key={user.id}>
          <td>
            {actions.length ? (
              <ButtonGroup>
                <Button onClick={() => onClick(user)} bsStyle="default">
                  {`${user.email} ${user.isAdmin ? '(a)' : ''}`}
                </Button>
                <DropdownButton>
                  {UsersList.renderActions(user, actions)}
                </DropdownButton>
              </ButtonGroup>
            ) : (
              <Button
                bsStyle="primary"
                role="link"
                onClick={() => onClick(user.id)}
              >
                <User user={user} link={false} />
              </Button>
            )}
            {user.role ? ` [${user.role}]` : ''}
          </td>
        </tr>
      ));
    return (
      <Fragment>
        {/* <input
          type="text"
          value={input}
          onChange={e => this.onInputChange(e)}
        /> */}
        {users}
      </Fragment>
    );
  }
}

export default UsersList;
