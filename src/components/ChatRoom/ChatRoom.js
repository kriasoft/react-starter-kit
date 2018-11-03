import React from 'react'
import { FormGroup, ControlLabel, FormControl, Form, Button } from 'react-bootstrap'
import io from 'socket.io-client'
import ChatTable from '../ChatTable'


class ChatRoomComponent extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      newMessage: ''
    }

    this.socket = io('http://localhost:3003')
    this.setNewMessage = this.setNewMessage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.socket.on('chat', message => {
      message.key = JSON.stringify(message)
      let messages = this.state.messages || [];
      this.setState((prevState) => {
          if(message.message!='')
            messages.push(message)
        {
          this.setState({messages});
        }
      })
    })
  }

  render() {
    return (
      <div>
        <Form inline onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Message</ControlLabel>{' '}
            <FormControl
              id="message"
              type="text"
              label="Message"
              placeholder="Enter your message"
              onChange={this.setNewMessage}
              value={this.state.newMessage}
              autoComplete="off"
            />
          </FormGroup>
          <Button type="submit">Send</Button>
        </Form>

        <ChatTable messages={this.state.messages} />
      </div>
    )
  }

  componentWillUnmount() {
    this.socket.close()
  }

  setNewMessage(event) {
    this.setState({
      newMessage: event.target.value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.socket.emit('chat', {
      name: this.props.name, 
      message: this.state.newMessage,
      timestamp: new Date().toISOString()
    })
    this.setState({
      newMessage: ''
    })
  }
}

export default ChatRoomComponent