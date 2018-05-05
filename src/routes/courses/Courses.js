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
import { createCourse, fetchCourses } from '../../actions/courses';

class Courses extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
    getCourses: PropTypes.func.isRequired,
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
      show: false,
    };
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    const user = this.props.user || {};
    const { getCourses } = this.props;
    getCourses(!user.isAdmin);
  }

  close() {
    this.setState({ show: false });
  }

  render() {
    const { user, courses, onSubmitClick, title } = this.props;
    const { courseName, show } = this.state;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <div>
            <h1>
              {title}
              {user ? (
                <Button onClick={() => this.setState({ show: true })}>
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
          value={courseName}
          title="Course"
          show={show}
          onInputChange={e => this.setState({ courseName: e.target.value })}
          onSubmitClick={() => {
            onSubmitClick(courseName);
            this.close();
          }}
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

const mapDispatchToProps = dispatch => ({
  onSubmitClick: title => {
    dispatch(createCourse(title));
  },
  getCourses: role => {
    dispatch(fetchCourses(role));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(s)(Courses),
);
