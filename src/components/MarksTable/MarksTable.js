import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default function MarksTable({ marks, children }) {
  return (
    <Fragment>
      <h3>Marks list</h3>
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>N</th>
            <th>Mark</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {marks}
          {children()}
        </tbody>
      </Table>
    </Fragment>
  );
}

MarksTable.propTypes = {
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      mark: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.func.isRequired,
};
