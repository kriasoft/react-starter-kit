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
import { Modal, Button, FormControl, Table } from 'react-bootstrap';
import TextEditor from '../../components/TextEditor';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study_entities';

let dispatch;
let fetch;

class Course extends React.Component {
  static propTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
    }).isRequired,
    fetch: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      studyEntities: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    dispatch = props.store.dispatch;
    fetch = props.fetch;
    this.state = {
      studyEntityBody: '',
      showModal: false,
      showModalSubscribe: false,
      studyEntityName: '',
      studyEntities: this.props.store.getState().course.studyEntities,
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openStEn = this.openStEn.bind(this);
    this.closeStEn = this.closeStEn.bind(this);
    this.openSubs = this.openSubs.bind(this);
    this.closeSubs = this.closeSubs.bind(this);
  }

  componentDidMount() {
    const self = this;
    this.props.store.subscribe(() => {
      this.setState({
        studyEntities: this.props.store.getState().course.studyEntities,
      });
    });
    async function getUsers() {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `{users
            { id, email }
          }`,
        }),
      });
      const { data } = await resp.json();
      self.setState({ users: data.users });
    }
    getUsers();
  }

  handleChange(event) {
    this.setState({ studyEntityName: event.target.value });
  }

  handleChangeBody(val) {
    this.setState({ studyEntityBody: val });
  }

  closeStEn() {
    this.setState({ showModal: false });
  }

  openStEn() {
    this.setState({ showModal: true });
  }

  closeSubs() {
    this.setState({ showModalSubscribe: false });
  }

  openSubs() {
    this.setState({ showModalSubscribe: true });
  }

  render() {
    const self = this;
    async function add() {
      const resp = await fetch('/graphql', {
        body: JSON.stringify({
          query: `mutation create($courseId: String, $title: String, $body: String){ 
            createStudyEntity(
              title: $title,
              courseId: $courseId,
              body: $body)
            { id, title }
          }`,
          variables: {
            title: self.state.studyEntityName,
            courseId: self.props.course.id,
            body: self.state.studyEntityBody,
          },
        }),
      });
      const { data } = await resp.json();
      dispatch(addStudyEntity(data.createStudyEntity));
      self.close();
    }
    const studyEntitiesList = [];
    for (let i = 0; i < this.state.studyEntities.length; i += 1) {
      studyEntitiesList.push(
        <li key={this.state.studyEntities[i].id}>
          <a
            href={`/courses/${this.props.course.id}/${this.props.course
              .studyEntities[i].id}`}
          >
            {this.state.studyEntities[i].title}
          </a>
        </li>,
      );
    }
    const usersList = [];
    for (let i = 0; this.state.users && i < this.state.users.length; i += 1) {
      const email = this.state.users[i].email;
      usersList.push(
        <tr key={this.state.users[i].id}>
          <td>
            {i + 1}
          </td>
          <td>
            {email}
          </td>
        </tr>,
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.title}
          </h1>
          <ol>
            {studyEntitiesList}
          </ol>
        </div>
        <Button bsStyle="primary" onClick={this.openStEn}>
          Add study entity
        </Button>
        <Modal show={this.state.showModal} onHide={this.closeStEn}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Course name</h4>
            <FormControl
              type="text"
              value={this.state.studyEntityName}
              onChange={this.handleChange}
            />
            <div>
              <br />
              <TextEditor
                value={this.state.studyEntityBody}
                onChange={this.handleChangeBody}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={add}>Add study entity</Button>
            <Button onClick={this.closeStEn}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Button bsStyle="primary" onClick={this.openSubs}>
          Subscribe user
        </Button>
        <Modal show={this.state.showModalSubscribe} onHide={this.closeSubs}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <h4>Subscribed</h4>
              </div>
              <div className="col-md-6">
                <h4>All courses</h4>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>User email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList}
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={add}>Save</Button>
            <Button onClick={this.closeSubs}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(Course);
