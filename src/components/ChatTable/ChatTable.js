import React from 'react'
import { Table } from 'react-bootstrap'

class ChatTableComponent extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Table striped hover>
        <tbody>
          {this.props.messages.map( message =>
            <tr key={message.key}>
              <td className="name-column">{message.name}</td>
              <td>{message.message}</td>
            </tr>
          )}
        </tbody>
      </Table>
    )
  }
}

export default ChatTableComponent