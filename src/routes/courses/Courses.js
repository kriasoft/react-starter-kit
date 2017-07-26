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
import { addCourse } from '../../actions/courses';

let dispatch;
let fetch;

class Courses extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    store: PropTypes.objectOf(React.Store).isRequired,
    dispatch: PropTypes.func.isRequired,
    fetch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    dispatch = props.store.dispatch;
    fetch = props.fetch;
    this.state = {
      courses: this.props.store.getState().courses.courses,
    };
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        courses: this.props.store.getState().courses.courses,
      });
    });
  }

  render() {
    async function add() {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: 'mutation { createCourse(title: "hello") { id, title } }	',
        }),
      });
      const { data } = await resp.json();
      dispatch(addCourse(data.createCourse));
    }
    const coursesList = [];
    for (let i = 0; i < this.state.courses.length; i += 1) {
      coursesList.push(
        <li key={this.state.courses[i].id}>
          <a href={`/courses/${this.state.courses[i].id}`}>
            {this.state.courses[i].title}
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
          <ol>
            {coursesList}
          </ol>
          <button onClick={add}>Add Course</button>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Courses);
