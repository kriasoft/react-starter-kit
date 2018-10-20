import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from '../Link';

const CoursesList = ({ courses, user }) => (
  <ol>
    {courses.map(
      ({ id, title }) =>
        user.isAdmin ? (
          <li key={id}>
            <Link to={`/courses/${id}`}>{title} </Link>
          </li>
        ) : (
          <li key={id}>{title}</li>
        ),
    )}
  </ol>
);

CoursesList.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  user: PropTypes.shape({
    isAdmin: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(CoursesList);
