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
import s from './Courses.css';

class Courses extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    courses: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  render() {
    const coursesList = [];
    for (let i = 0; i < this.props.courses.length; i += 1) {
      coursesList.push(
        <li>
          <a href={`/courses/${this.props.courses[i].id}`}>
            {this.props.courses[i].title}
          </a>
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <p>
            <ol>
              {coursesList}
            </ol>
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Courses);
