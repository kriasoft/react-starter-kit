import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

function toFixed(num) {
  if (num) return num.toFixed(2);
  return null;
}

const AnswerList = ({ unit }) => (
  <tr>
    <td>{unit.title}</td>
    <td>{toFixed(_.get(unit, 'answers[0].marks[0].mark')) || 'no mark'}</td>
  </tr>
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
