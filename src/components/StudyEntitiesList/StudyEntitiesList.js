import React from 'react';
import PropTypes from 'prop-types';

const StudyEntitiesList = ({ courseId, studyEntities }) => (
  <ol>
    {studyEntities.map(({ id, title }) => (
      <li key={id}>
        <a href={`/courses/${courseId}/${id}`}>{title}</a>
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
  courseId: PropTypes.string.isRequired,
};

export default StudyEntitiesList;
