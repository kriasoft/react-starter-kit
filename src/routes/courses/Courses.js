import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import s from './Courses.css';
import ModalAdd from '../../components/ModalAdd';
import { createCourse } from '../../actions/courses';
import CoursesList from '../../components/CoursesList';

class Courses extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
  };

  render() {
    const { userId, courses, title, dispatch } = this.props;
    const student = courses.filter(
      ({ users }) => users.length > 0 && users[0].role === 'student',
    );
    const teacher = courses.filter(
      ({ users }) => users.length > 0 && users[0].role === 'teacher',
    );
    const all = courses.filter(({ users }) => !users.length);

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {title}
            {userId && <ModalAdd onUpdate={t => dispatch(createCourse(t))} />}
          </h1>
          {student.length > 0 && (
            <Fragment>
              <h5>Student:</h5>
              <CoursesList courses={student} />
            </Fragment>
          )}
          {teacher.length > 0 && (
            <Fragment>
              <h5>Teacher:</h5>
              <CoursesList courses={teacher} />
            </Fragment>
          )}
          {all.length > 0 && (
            <Fragment>
              <h5>All:</h5>
              <CoursesList courses={all} />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  courses: state.courses,
  userId: state.user && state.user.id,
});
export default connect(mapStateToProps)(withStyles(s)(Courses));
