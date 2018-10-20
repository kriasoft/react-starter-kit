import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import ModalEditor from '../../components/ModalEditor';
import UnitsList from '../../components/UnitsList';
import s from './Course.css';
import { addUnit } from '../../actions/units';
import { updateCourse } from '../../actions/courses';
import ModalWithUsers from '../../components/ModalWithUsers';
import ModalAdd from '../../components/ModalAdd';

function Course({ user, course, dispatch }) {
  const { units, id, title } = course;
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1>
          {title}
          {user && (
            <Fragment>
              <ModalAdd
                title={title}
                onUpdate={t => dispatch(updateCourse(t))}
              />
              <ModalEditor onCreate={unit => dispatch(addUnit(unit))} />
            </Fragment>
          )}
        </h1>
        <UnitsList units={units} courseId={id} />
        <ModalWithUsers />
      </div>
    </div>
  );
}

Course.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  course: PropTypes.shape({
    units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ),
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

Course.contextTypes = {
  fetch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  course: state.course,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(s)(Course));
