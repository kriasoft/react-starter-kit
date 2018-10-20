import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link/Link';

const UnitsList = ({ courseId, units }) => (
  <ol>
    {units.map(({ id, title }) => (
      <li key={id}>
        <Link to={`/courses/${courseId}/${id}`}>{title}</Link>
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
  courseId: PropTypes.string.isRequired,
};

export default UnitsList;
