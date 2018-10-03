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
import { createUnit } from '../../actions/units';
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
    createUnit: PropTypes.func.isRequired,
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

  createUnit = async ({ title, body }) => {
    const { id } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation createUnit($id: String!, $title: String!, $body: String){
          createUnit(
            title: $title,
            courseId: $id,
            body: $body)
          { id, title }
        }`,
        variables: {
          title,
          id,
          body,
        },
      }),
    });
    const { data } = await resp.json();
    this.props.createUnit(data.createUnit);
  };

  updateCourse = async title => {
    const { id } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation updateCourse($id: String!, $title: String){
          updateCourse (
            title: $title,
            id: $id)
          { id, title }
        }`,
        variables: {
          title,
          id,
        },
      }),
    });
    const { data } = await resp.json();
    this.props.updateCourse(data.updateCourse);
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
                <ModalAdd title={title} onUpdate={this.updateCourse} />
                <ModalEditor onCreate={this.createUnit} />
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
  { updateCourse, createUnit },
)(withStyles(s)(Course));
