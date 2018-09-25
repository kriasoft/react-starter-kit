/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import {
  Form,
  FormControl,
  FormGroup,
  Button,
  DropdownButton,
  MenuItem,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import * as moment from 'moment';
import { connect } from 'react-redux';
import TextEditor from '../../components/TextEditor';
import MarksTable from '../../components/MarksTable';
import StudyEntityView from '../../components/StudyEntityView';
import { setStudyEntityHeaders } from '../../actions/study-entity';
import s from './StudyEntity.css';
import IconButton from '../../components/IconButton/IconButton';

class StudyEntity extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    setStudyEntityHeaders: PropTypes.func.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
    }),
    studyEntity: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string,
    }).isRequired,
  };

  static contextTypes = {
    fetch: PropTypes.func.isRequired,
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
      editMode: false,
      title: this.props.studyEntity.title,
      body: this.props.studyEntity.body,
      answerId: null,
      mark: 0,
      comment: '',
      answer: {},
    };
    this.switchMode = this.switchMode.bind(this);
    this.changeTitle = this.changeTitle.bind(this);
    this.changeBody = this.changeBody.bind(this);
    this.changeAnswer = this.changeAnswer.bind(this);
    this.saveAnswer = this.saveAnswer.bind(this);
    this.save = this.save.bind(this);
    this.addMark = this.addMark.bind(this);
    this.changeMark = this.changeMark.bind(this);
    this.changeComment = this.changeComment.bind(this);
    this.cancel = this.cancel.bind(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.updateHeaders = this.updateHeaders.bind(this);
  }

  async componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.retrieveAnswer();
    }
  }

  getValidationState() {
    const { mark } = this.state;
    if (mark <= 100 && mark >= 0) return 'success';
    return 'error';
  }

  changeTitle(event) {
    this.setState({ title: event.target.value });
  }

  changeBody(val) {
    this.setState({ body: val });
  }

  changeMark(event) {
    this.setState({ mark: event.target.value });
  }

  changeComment(event) {
    this.setState({ comment: event.target.value });
  }

  changeAnswer(val) {
    this.setState({ answer: val });
  }

  async uploadFile(key, file) {
    const { user } = this.props;
    const formData = new FormData();
    formData.append(
      'query',
      `mutation uploadFile($internalName: String!, $userId: String!) {
        uploadFile(internalName: $internalName, userId: $userId) { id }
      }`,
    );
    formData.append(
      'variables',
      JSON.stringify({
        userId: user.id,
        internalName: file.name,
      }),
    );
    formData.append('file', file);
    const res = await this.context.fetch('/graphql', {
      body: formData,
    });
    const { data } = await res.json();
    return { key, data: { type: 'file', id: data.uploadFile.id } };
  }

  async postProcessAnswer(answer) {
    const res = { ...answer };
    const files = Object.entries(answer).filter(
      ans => ans[1] instanceof window.File,
    );
    const tasks = [];
    for (let i = 0; i < files.length; i += 1) {
      tasks.push(this.uploadFile(files[i][0], files[i][1]));
    }
    const filesData = await Promise.all(tasks);
    filesData.forEach(fd => {
      res[fd.key] = fd.data;
    });
    return res;
  }

  async saveAnswer() {
    const { user, course, studyEntity } = this.props;
    if (this.state.answerId) {
      const answer = await this.postProcessAnswer(this.state.answer);
      await this.context.fetch('/graphql', {
        body: JSON.stringify({
          query: `mutation update(
            $body: String,
            $id: String
          ){
            updateAnswer(
              body: $body,
              id: $id
            ){
              id
            }            
          }`,
          variables: {
            body: JSON.stringify(answer),
            id: this.state.answerId,
          },
        }),
      });
    } else {
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
            courseId: course.id,
            userId: user.id,
            studyEntityId: studyEntity.id,
          },
        }),
      });
    }
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

  async addMark() {
    const { user } = this.props;
    const { mark, comment, answerId } = this.state;
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation addMark($mark: Float, $comment: String, $answerId: String, $authorId: String) {
          addMark(
            mark: $mark,
            comment: $comment,
            answerId: $answerId,
            authorId: $authorId,            
          ) {
            id
          }     
        }`,
        variables: {
          mark,
          comment,
          answerId,
          authorId: user.id,
        },
      }),
    });
    /* this.setState({
      mark: '',
      comment: '',
    }); */
  }

  async retrieveAnswer() {
    const { user, course, studyEntity } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `query retrieveAnswers (
          $userIds: [String]
          $studyEntityIds: [String]
          $courseIds: [String]
        ){
          answers(
            userIds: $userIds,
            studyEntityIds: $studyEntityIds,
            courseIds: $courseIds
          ){
            id, body, marks {
              id, mark, comment, createdAt
            },
            user { 
              id, profile {
                displayName
              }
            },
            createdAt
          }            
        }`,
        variables: {
          userIds: !user.isAdmin && [user.id],
          studyEntityIds: [studyEntity.id],
          courseIds: [course.id],
        },
      }),
    });
    const { data } = await resp.json();
    if (data && data.answers && data.answers.length) {
      const answerCur = 0;
      this.setState({
        answers: data.answers.map(answer => {
          const ans = answer;
          ans.body = JSON.parse(answer.body);
          return ans;
        }),
        answerId: data.answers[answerCur].id,
        answer: data.answers[answerCur].body,
        answerCur,
      });
    }
  }

  selectAnswer(eventKey) {
    const answerCur = parseInt(eventKey, 10);
    this.setState({
      answerCur,
      answer: this.state.answers[answerCur].body,
      answerId: this.state.answers[answerCur].id,
    });
  }

  updateHeaders(headers) {
    this.props.setStudyEntityHeaders(headers);
  }

  render() {
    const { user } = this.props;
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
          <IconButton onClick={this.save} glyph="ok" />
          <IconButton onClick={this.cancel} glyph="remove" />
        </span>
      );
    } else {
      bodyComponent = (
        <span>
          <StudyEntityView
            answerId={this.state.answerId}
            value={this.state.answer}
            body={this.state.body}
            onChange={this.changeAnswer}
            onHeadersChange={this.updateHeaders}
          />
          {user && <Button onClick={this.saveAnswer}>Save</Button>}
        </span>
      );
      headerComponent = (
        <span>
          {this.state.title}
          {user.role === 'teacher' && (
            <IconButton onClick={this.switchMode} glyph="pencil" />
          )}
        </span>
      );
    }
    let answerChooser;
    let markView;
    if (user && user.isAdmin && this.state.answers) {
      const answerTitle = answer =>
        `${answer.user.profile.displayName} ${answer.createdAt}`;
      const answers = this.state.answers.map((answer, i) => (
        <MenuItem
          key={answer.id}
          eventKey={i}
          active={i === this.state.answerCur}
        >
          {answerTitle(answer)}
        </MenuItem>
      ));
      answerChooser = (
        <DropdownButton
          id="answer_chooser"
          title={answerTitle(this.state.answers[this.state.answerCur])}
          onSelect={this.selectAnswer}
        >
          {answers}
        </DropdownButton>
      );
      const marks = this.state.answers[this.state.answerCur].marks.map(
        (mark, i) => (
          <tr key={mark.id}>
            <td>{i + 1}</td>
            <td>{mark.mark}</td>
            <td>{mark.comment}</td>
            <td>
              {moment(mark.createdAt).fromNow()} (
              {moment(mark.createdAt).format('llll')})
            </td>
          </tr>
        ),
      );
      markView = (
        <div>
          <MarksTable marks={marks}>
            {() => (
              <tr>
                <td />
                <td>
                  <Form inline>
                    <FormGroup
                      controlId="Mark"
                      validationState={this.getValidationState()}
                    >
                      <FormControl
                        type="number"
                        placeholder="Mark"
                        value={this.state.mark}
                        onChange={this.changeMark}
                      />
                    </FormGroup>
                  </Form>
                </td>
                <td>
                  <Form inline>
                    <FormGroup controlId="Comment">
                      <FormControl
                        type="text"
                        placeholder="Comment"
                        value={this.state.comment}
                        onChange={this.changeComment}
                      />
                    </FormGroup>
                  </Form>
                </td>
                <td>
                  {this.getValidationState() === 'success' && (
                    <IconButton onClick={this.addMark} glyph="ok" />
                  )}
                </td>
              </tr>
            )}
          </MarksTable>
          {/* Form for setting marks and making a comment */}
        </div>
      );
    }

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            <a href={`/courses/${this.props.course.id}`}>
              {this.props.course.title}
            </a>
            /{headerComponent}
            {answerChooser}
          </h1>
          {bodyComponent}
          {markView}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  lol: state.studyEntities,
});

export default connect(
  mapStateToProps,
  { setStudyEntityHeaders },
)(withStyles(s)(StudyEntity));
