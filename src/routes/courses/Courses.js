import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import CoursesList from '../../components/CoursesList';
import { showModal } from '../../actions/modals';
import s from './Courses.css';
import IconButton from '../../components/IconButton';
import ModalCourse from '../../components/ModalCourse/ModalCourse';

class Courses extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    userId: PropTypes.string,
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
  };

  static defaultProps = {
    userId: null,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
  };

  state = {};

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

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
          <ModalCourse modalId="modalAddCourse" edit={false} />
          <h1>
            {title}
            {userId && (
              // eslint-disable-next-line react/prop-types
              <IconButton
                onClick={() => dispatch(showModal('modalAddCourse'))}
                glyph="plus"
              />
            )}
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
  modals: state.modals,
});
export default connect(mapStateToProps)(withStyles(s)(Courses));
