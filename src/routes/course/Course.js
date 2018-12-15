import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import UnitsList from '../../components/UnitsList';
import s from './Course.css';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';
import ModalCourseEdit from '../../components/ModalCourseEdit';
import ModalUnit from '../../components/ModalUnit';

function getRole({ users } = { users: [] }, user) {
  return (users.find(u => u.id === user.id) || {}).role;
}

function Course({ user, course, dispatch }) {
  const { units, id, title } = course;
  const role = getRole(course, user);
  return (
    <div className={s.root}>
      <ModalCourseEdit modalId="modalCourseEdit" />
      <ModalUnit modalId="modalUnitAdd" edit={false} />
      <div className={s.container}>
        <h1>
          {title}
          <Fragment>
            {(user || {}).isAdmin && (
              <IconButton
                onClick={() => dispatch(showModal('modalCourseEdit'))}
                glyph="pencil"
              />
            )}
            {role === 'teacher' && (
              <IconButton
                onClick={() => dispatch(showModal('modalUnitAdd'))}
                glyph="plus"
              />
            )}
          </Fragment>
        </h1>
        <UnitsList units={units} courseId={id} role={role} />
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
