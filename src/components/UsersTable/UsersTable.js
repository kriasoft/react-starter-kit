import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function UsersTable({ users }) {
  return (
    <Table striped bordered condensed hover>
      <thead>
        <tr>
          <th>User email</th>
        </tr>
      </thead>
      <tbody>{users}</tbody>
    </Table>
  );
}

UsersTable.propTypes = {
  users: PropTypes.element.isRequired,
};
