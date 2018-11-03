import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

class ChatTableComponent extends React.Component {
  render() {
    return (
      <Table striped hover>
        <tbody>
          {this.props.messages.map(message => (
            <tr key={message.key}>
              <td className="name-column">{message.name}</td>
              <td>{message.message}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}
ChatTableComponent.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default ChatTableComponent;
