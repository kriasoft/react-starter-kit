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
import { Modal, Button, FormControl } from 'react-bootstrap';
import s from './Courses.css';
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
    this.open = this.open.bind(this);
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

  open() {
    this.setState({ showModal: true });
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
        <Button bsStyle="primary" onClick={this.open}>
          Add Course
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Course name</h4>
            <FormControl
              type="text"
              value={this.state.courseName}
              onChange={this.handleChange}
            />
            <div>
              <br />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.add}>Add Course</Button>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(Courses);
