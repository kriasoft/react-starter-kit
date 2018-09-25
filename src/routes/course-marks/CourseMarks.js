import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const AnswerList = ({ answers, stydyEntity }) => (
  <Table>
    <thead>
      <tr>
        <th scope="col">{stydyEntity.title}</th>
        <th scope="col">Mark</th>
      </tr>
      {answers.map(ans => (
        <tr>
          <td>{ans.title}</td>
          <td>{ans.mark}</td>
        </tr>
      ))}
    </thead>
  </Table>
);
AnswerList.propTypes = {
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  stydyEntity: PropTypes.shape({
    title: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default AnswerList;
