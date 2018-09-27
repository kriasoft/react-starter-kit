import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const AnswerList = ({ unit }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{unit.title}</th>
        <th>Date</th>
        <th scope="col">Mark</th>
      </tr>
      {unit.answers[0] !== undefined ? (
        unit.answers[0].marks.map(mark => (
          <tr>
            <td>NameAnswer</td>
            <td>{mark.createdAt.substr(0, 10) || 'No'}</td>
            <td>{mark.mark.toFixed(2) || 'No'}</td>
          </tr>
        ))
      ) : (
        <tr>not mark</tr>
      )}
    </thead>
  </Table>
);
AnswerList.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        marks: PropTypes.arrayOf(
          PropTypes.shape({
            createdAt: PropTypes.string,
            id: PropTypes.string,
            mark: PropTypes.float,
          }),
        ),
      }),
    ),
  }).isRequired,
};

export default AnswerList;
