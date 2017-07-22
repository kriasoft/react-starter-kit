/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Course.css';

class Course extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      studyEntities: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      })),
    }).isRequired,
  };

  render() {
    const studyEntitiesList = [];
    for (let i = 0; i < this.props.course.studyEntities.length; i += 1) {
      studyEntitiesList.push(<li className={s.item}>
        <a href={`/courses/${this.props.course.id}/${this.props.course.studyEntities[i].id}`}>
          {this.props.course.studyEntities[i].title}
        </a>
      </li>);
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <ol>{studyEntitiesList}</ol>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Course);
