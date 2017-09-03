/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TextEditor from '../../components/TextEditor';
import StudyEntityView from '../../components/StudyEntityView';
import s from './StudyEntity.css';

class StudyEntity extends React.Component {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
    store: PropTypes.any.isRequired,
  };
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    studyEntity: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      title: this.props.studyEntity.title,
      body: this.props.studyEntity.body,
    };
    this.switchMode = this.switchMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeBody = this.changeBody.bind(this);
    this.changeAnswer = this.changeAnswer.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  changeTitle(event) {
    this.setState({ title: event.target.value });
  }

  changeBody(val) {
    this.setState({ body: val });
  }

  changeAnswer(val) {
    this.setState({ answer: val });
  }
  async saveAnswer() {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation add(
          $body: String,
          $courseId: String,
          $userId: String,
          $studyEntityId: String
        ){
          addAnswer(
            body: $body,
            courseId: $courseId,
            userId: $userId,
            studyEntityId: $studyEntityId
          ){
            id
          }            
        }`,
        variables: {
          body: JSON.stringify(this.state.answer),
          courseId: this.props.course.id,
          userId: this.context.store.getState().user.id,
          studyEntityId: this.props.studyEntity.id,
        },
      }),
    });
  }

  switchMode() {
    this.setState({ editMode: !this.state.editMode });
  }

  async save() {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($title: String, $id: String, $body: String) {
          updateStudyEntity(
            title: $title,
            id: $id,
            body: $body,
          ){
            id,title  
          }            
        }`,
        variables: {
          title: this.state.title,
          id: this.props.studyEntity.id,
          body: this.state.body,
        },
      }),
    });
    this.switchMode();
  }

  cancel() {
    // TODO: change cancel bahaviour when user save values once
    this.setState({
      editMode: false,
      title: this.props.studyEntity.title,
      body: this.props.studyEntity.body,
    });
  }

  render() {
    let bodyComponent;
    let headerComponent;
    if (this.state.editMode) {
      bodyComponent = (
        <TextEditor value={this.state.body} onChange={this.changeBody} />
      );
      headerComponent = (
        <span>
          <input
            value={this.state.title}
            type="text"
            onChange={this.changeTitle}
          />
          <Button onClick={this.save}>
            <Glyphicon glyph="ok" />
          </Button>
          <Button onClick={this.cancel}>
            <Glyphicon glyph="remove" />
          </Button>
        </span>
      );
    } else {
      bodyComponent = (
        <span>
          <StudyEntityView
            body={this.state.body}
            onChange={this.changeAnswer}
          />
          <Button onClick={this.saveAnswer}>Save</Button>
        </span>
      );
      headerComponent = (
        <span>
          {this.state.title}
          <Button onClick={this.switchMode}>
            <Glyphicon glyph="pencil" />
          </Button>
        </span>
      );
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            {this.props.course.title}/{headerComponent}
          </h1>
          {bodyComponent}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(StudyEntity);
