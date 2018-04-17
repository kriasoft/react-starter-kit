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
import { Button, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
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
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    courses: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
  };

  static defaultProps = {
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.close = this.close.bind(this);
    this.add = this.add.bind(this);
  }

  handleChange(event) {
    this.setState({ courseName: event.target.value });
  }

  handleOpen() {
    this.setState({ showModal: true });
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
    const { user, courses } = this.props;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div>
            <h1>
              {this.props.title}
              {user ? (
                <Button onClick={this.handleOpen}>
                  <Glyphicon glyph="glyphicon glyphicon-plus" />
                </Button>
              ) : null}
            </h1>
          </div>
          <ol>
            {courses.map(c => (
              <li key={c.id}>
                {' '}
                <a href={`/courses/${c.id}`}>{c.title} </a>{' '}
              </li>
            ))}
          </ol>
        </div>
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

const mapStateToProps = state => ({
  courses: state.courses,
  user: state.user,
});

export default connect(mapStateToProps)(withStyles(s)(Courses));
