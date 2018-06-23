import React from 'react';
import PropTypes from 'prop-types';

const CoursesList = ({ courses }) => (
  <ol>
    {courses.map(c => (
      <li key={c.id}>
        <a href={`/courses/${c.id}`}>{c.title} </a>
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
