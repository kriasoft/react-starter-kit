import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function UsersTable({ children }) {
  return (
    <Table striped bordered responsive hover>
      <thead>
        <tr>
          <th>User email</th>
        </tr>
      </thead>
      <tbody>{children()}</tbody>
    </Table>
  );
}

UsersTable.propTypes = {
  children: PropTypes.element.isRequired,
};
