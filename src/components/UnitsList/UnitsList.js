import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

const UnitsList = ({ courseId, units, role }) => (
  <ol>
    {units.map(({ id, title }) => (
      <li key={id}>
        {['student', 'teacher'].includes(role) ? (
          <Link to={`/courses/${courseId}/${id}`}>{title}</Link>
        ) : (
          <span>{title}</span>
        )}
      </li>
    ))}
  </ol>
);

UnitsList.propTypes = {
  units: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  role: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default UnitsList;
