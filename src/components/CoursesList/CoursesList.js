import React from 'react';
import PropTypes from 'prop-types';

const CoursesList = ({ courses }) => (
  <ol>
    {courses.map(({ id, title }) => (
      <li key={id}>
        <a href={`/courses/${id}`}>{title} </a>
      </li>
    ))}
  </ol>
);

CoursesList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
};

export default CoursesList;
