import React from 'react';
import PropTypes from 'prop-types';

const UnitsList = ({ courseId, units }) => (
  <ol>
    {units.map(({ id, title }) => (
      <li key={id}>
        <a href={`/courses/${courseId}/${id}`}>{title}</a>
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
