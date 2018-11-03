import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-bootstrap'
import ChatRoom from '../ChatRoom'


class ChatWS extends React.Component {
  static contextTypes = { store: PropTypes.any.isRequired };
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      user:{
        id:PropTypes.string.isRequired
      }
    }
    this.handleSubmitName = this.handleSubmitName.bind(this)
  }

  render() {
    const { user } = this.context.store.getState();
    {user ? (this.state.name=user.email) : (this.state.name='')}

    return (
      <Grid>
        {user ? (
          <Grid>
          {!this.state.name &&
            <ChatName
              handleSubmitName={this.handleSubmitName}
            />
          }
          {this.state.name &&
            <ChatRoom
              name={this.state.name}
            />
          }
        </Grid>  
        ):(
          <p></p>        
        )}
      </Grid>
    )
  }

  handleSubmitName(name) {
    this.setState({
      name: name
    })
  }
}
export default ChatWS;