/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import ModalEditor from '../../components/ModalEditor';
import UnitsList from '../../components/UnitsList';
import s from './Course.css';
import { addUnit } from '../../actions/units';
import { updateCourse } from '../../actions/courses';
import ModalWithUsers from '../../components/ModalWithUsers/ModalWithUsers';
import ModalAdd from '../../components/ModalAdd';

class Course extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }).isRequired,
    updateCourse: PropTypes.func.isRequired,
    addUnit: PropTypes.func.isRequired,
    units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };

  render() {
    const { user, units, id, title } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {title}
            {user && (
              <Fragment>
                <ModalAdd
                  title={title}
                  onUpdate={t => this.props.updateCourse(t)}
                />
                <ModalEditor onCreate={unit => this.props.addUnit(unit)} />
              </Fragment>
            )}
          </h1>
          <UnitsList units={units} courseId={id} />
          <ModalWithUsers />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  units: state.course.units,
  id: state.course.id,
  title: state.course.title,
  user: state.user,
});

export default connect(
  mapStateToProps,
  { updateCourse, addUnit },
)(withStyles(s)(Course));
