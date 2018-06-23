import React from 'react';
import PropTypes from 'prop-types';

const StudyEntitiesList = ({ course, studyEntities }) => (
  <ol>
    {studyEntities.map(se => (
      <li key={se.id}>
        <a href={`/courses/${course.id}/${se.id}`}>{se.title}</a>
      </li>
    ))}
  </ol>
);

StudyEntitiesList.propTypes = {
  studyEntities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    studyEntities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default StudyEntitiesList;
