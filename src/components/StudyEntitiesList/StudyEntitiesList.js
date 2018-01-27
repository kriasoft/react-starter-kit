import React from 'react';
import PropTypes from 'prop-types';

class StudyEntitiesList extends React.Component {
  static propTypes = {
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
  render() {
    const { studyEntities, course } = this.props;

    return (
      <ol>
        {studyEntities.map(se => (
          <li key={se.id}>
            <a href={`/courses/${course.id}/${se.id}`}>{se.title}</a>
          </li>
        ))}
      </ol>
    );
  }
}

export default StudyEntitiesList;
