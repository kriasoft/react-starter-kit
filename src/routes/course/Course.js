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
import TextEditor from '../../components/TextEditor';
import s from './Course.css';
import { addStudyEntity } from '../../actions/study_entities';

let dispatch;
let fetch;

class Course extends React.Component {
  static propTypes = {
    store: PropTypes.objectOf(React.store).isRequired,
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
      studyEntityName: '',
      studyEntities: this.props.store.getState().course.studyEntities,
    };
    this.handleChangeBody = this.handleChangeBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.props.store.subscribe(() => {
      this.setState({
        studyEntities: this.props.store.getState().course.studyEntities,
      });
    });
  }

  handleChange(event) {
    this.setState({ studyEntityName: event.target.value });
  }

  handleChangeBody(val) {
    this.setState({ studyEntityBody: val });
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
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
        <Button bsStyle="primary" onClick={this.open}>
          Add study entity
        </Button>
        <Modal show={this.state.showModal} onHide={this.close}>
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
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default withStyles(s)(Course);
