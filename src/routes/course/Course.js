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
import { subscribeUser, unsubscribeUser } from '../../actions/courses';

class Course extends React.Component {
  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  static propTypes = {
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
      users: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
        }),
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      studyEntityBody: '',
      showModal: false,
      showModalSubscribe: false,
      studyEntityName: '',
      studyEntities: [],
      subscribedUsersList: [],
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addStEn = this.addStEn.bind(this);
    this.openStEn = this.openStEn.bind(this);
    this.closeStEn = this.closeStEn.bind(this);
    this.openSubs = this.openSubs.bind(this);
    this.closeSubs = this.closeSubs.bind(this);
  }

  componentWillMount() {
    this.setState({
      studyEntities: this.context.store.getState().course.studyEntities,
      subscribedUsersList: this.props.course.users.map(u => u.id),
    });
  }

  componentDidMount() {
    this.context.store.subscribe(() => {
      this.setState({
        studyEntities: this.context.store.getState().course.studyEntities,
      });
    });
    this.updateUsers();
  }

  async updateUsers() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `{users
          { id, email }
        }`,
      }),
    });
    const { data } = await resp.json();
    this.setState({ users: data.users });
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

  async subscribeUser(id, i) {
    this.state.subscribedUsersList.push(id);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  subscribe($id: String, $courseId: String){
          subscribeUser(
            id: $id,
            courseId: $courseId)
            { id }
        }`,
        variables: {
          id: this.state.users[i].id,
          courseId: this.props.course.id,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(subscribeUser(data.subscribeUser));
    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async unsubscribeUser(id) {
    const i = this.state.subscribedUsersList.indexOf(id);
    this.state.subscribedUsersList.splice(i, 1);
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation  unsubscribe($id: String, $courseId: String){
          unsubscribeUser(
            id: $id,
            courseId: $courseId)
            { id }
        }`,
        variables: {
          id,
          courseId: this.props.course.id,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(unsubscribeUser(data.unsubscribeUser));

    this.setState({
      subscribedUsersList: this.state.subscribedUsersList,
    });
  }

  async addStEn() {
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($courseId: String, $title: String, $body: String){ 
          createStudyEntity(
            title: $title,
            courseId: $courseId,
            body: $body)
          { id, title }
        }`,
        variables: {
          title: this.state.studyEntityName,
          courseId: this.props.course.id,
          body: this.state.studyEntityBody,
        },
      }),
    });
    const { data } = await resp.json();
    this.context.store.dispatch(addStudyEntity(data.createStudyEntity));
    this.closeStEn();
  }

  render() {
    const studyEntitiesList = [];
    for (let i = 0; i < this.state.studyEntities.length; i += 1) {
      studyEntitiesList.push(
        <li key={this.state.studyEntities[i].id}>
          <a
            href={`/courses/${this.props.course.id}/${
              this.props.course.studyEntities[i].id
            }`}
          >
            {this.state.studyEntities[i].title}
          </a>
        </li>,
      );
    }

    const usersList = [];
    for (let i = 0; this.state.users && i < this.state.users.length; i += 1) {
      // const email = this.state.users[i].email;
      const { id } = this.state.users[i];
      if (this.state.subscribedUsersList.indexOf(id) < 0) {
        usersList.push(
          <tr key={id}>
            <td>
              <Button
                bsStyle="primary"
                role="link"
                onClick={() => this.subscribeUser(id, i)}
              >
                {id}
              </Button>
            </td>
          </tr>,
        );
      }
    }
    const subscribedUsersList = this.state.subscribedUsersList.map(id => (
      <tr key={id}>
        <td>
          <Button
            bsStyle="primary"
            role="link"
            onClick={() => this.unsubscribeUser(id)}
          >
            {id}
          </Button>
        </td>
      </tr>
    ));
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <ol>{studyEntitiesList}</ol>
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
            <Button onClick={this.addStEn}>Add study entity</Button>
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
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>User email</th>
                    </tr>
                  </thead>
                  <tbody>{subscribedUsersList}</tbody>
                </Table>
              </div>
              <div className="col-md-6">
                <h4>Unsubscribed</h4>
                <Table striped bordered condensed hover>
                  <thead>
                    <tr>
                      <th>User email</th>
                    </tr>
                  </thead>
                  <tbody>{usersList}</tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeSubs}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(Course);
