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
import { Modal, Button, FormControl, Row, Col } from 'react-bootstrap';
import s from './User.css';

class User extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      profile: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        gender: PropTypes.string.isRequired,
        picture: PropTypes.string.isRequired,
      }).isRequired,
      courses: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      newPass: '',
      showModal: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  handleChange(event) {
    this.setState({ newPass: event.target.value });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  render() {
    const coursesList = [];
    const { courses } = this.props.user;
    for (let i = 0; i < courses.length; i += 1) {
      coursesList.push(
        <li key={courses[i].id}>
          <a href={`/courses/${courses[i].id}`}>{courses[i].title}</a>
        </li>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <Col xs={12} md={2}>
              <img
                className={s.picture}
                src={this.props.user.profile.picture}
                alt="Profile"
              />
            </Col>
            <Col xs={12} md={10}>
              <h1>
                {this.props.title} {this.props.user.profile.displayName}
              </h1>
              <div>Id: {this.props.user.id}</div>
              <div>Gender: {this.props.user.profile.gender}</div>
              <div>E-mail: {this.props.user.email}</div>
              <Button bsStyle="primary" onClick={this.open}>
                Change password
              </Button>
            </Col>
          </Row>
          <Row>
            <h2>Courses</h2>
            <Col xs={12} md={10}>
              {coursesList}
            </Col>
          </Row>
          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Change password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span>New password: </span>
              <FormControl
                type="text"
                value={this.state.newPass}
                onChange={this.handleChange}
              />
              <div>
                <br />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Change</Button>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(User);
