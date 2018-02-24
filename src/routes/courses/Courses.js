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
import { Button } from 'react-bootstrap';
import s from './Courses.css';
import ModalAdd from '../../components/ModalAdd';
import { addCourse } from '../../actions/courses';

class Courses extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      courses: [],
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.add = this.add.bind(this);
  }

  componentWillMount() {
    this.setState({
      courses: this.context.store.getState().courses.courses,
    });
  }

  componentDidMount() {
    this.context.store.subscribe(() => {
      this.setState({
        courses: this.context.store.getState().courses.courses,
      });
    });
  }

  handleChange(event) {
    this.setState({ courseName: event.target.value });
  }

  close() {
    this.setState({ showModal: false });
  }

  async add() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation createCourse($title: String) {
          createCourse(title: $title) { id, title } 
        }`,
        variables: {
          title: this.state.courseName,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addCourse(data.createCourse));
    this.close();
  }

  render() {
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
          <h1>{this.props.title}</h1>
          <ol>{coursesList}</ol>
        </div>
        <Button
          bsStyle="primary"
          onClick={() => {
            this.setState({ showModal: true });
          }}
        >
          Add Course
        </Button>
        <ModalAdd
          value={this.state.courseName}
          title="Course"
          show={this.state.showModal}
          onInputChange={this.handleChange}
          onSubmitClick={this.add}
          handleClose={this.close}
        />
      </div>
    );
  }
}

export default withStyles(s)(Courses);
