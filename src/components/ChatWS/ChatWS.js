import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap';
import ChatRoom from '../ChatRoom';

class ChatWS extends React.Component {
  static contextTypes = { store: PropTypes.any.isRequired };
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }

  render() {
    const { user } = this.context.store.getState();
    if (user !== null) this.state.name = user.email;

    return (
      <Grid>
        {user ? (
          <Grid>{this.state.name && <ChatRoom name={this.state.name} />}</Grid>
        ) : (
          <p />
        )}
      </Grid>
    );
  }
}
export default ChatWS;
