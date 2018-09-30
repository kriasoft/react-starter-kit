/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import TextEditor from '../../components/TextEditor';
import MarksTable from '../../components/MarksTable';
import UnitView from '../../components/UnitView';
import { setUnitHeaders } from '../../actions/unit';
import s from './Unit.css';
import IconButton from '../../components/IconButton/IconButton';

class Unit extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }).isRequired,
    role: PropTypes.string.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
    }),
    unit: PropTypes.shape({
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
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      title: this.props.unit.title,
      body: this.props.unit.body,
      answerId: null,
      answer: {},
    };
    this.saveAnswer = this.saveAnswer.bind(this);
    this.save = this.save.bind(this);
    this.addMark = this.addMark.bind(this);
  }

  async componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.retrieveAnswer();
    }
  }

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  switchMode = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  handleAnswerSelect = eventKey => {
    const answerCur = parseInt(eventKey, 10);
    this.setState({
      answerCur,
      answer: this.state.answers[answerCur].body,
      answerId: this.state.answers[answerCur].id,
    });
  };

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
    const { user, course, unit } = this.props;
    const answer = await this.postProcessAnswer(this.state.answer);
    if (this.state.answerId) {
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
            $unitId: String
          ){
            addAnswer(
              body: $body,
              courseId: $courseId,
              userId: $userId,
              unitId: $unitId
            ){
              id
            }
          }`,
          variables: {
            body: JSON.stringify(answer),
            courseId: course.id,
            userId: user.id,
            unitId: unit.id,
          },
        }),
      });
    }
  }

  async save() {
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation create($title: String, $id: String, $body: String) {
          updateUnit(
            title: $title,
            id: $id,
            body: $body,
          ){
            id,title
          }
        }`,
        variables: {
          title: this.state.title,
          id: this.props.unit.id,
          body: this.state.body,
        },
      }),
    });
    this.switchMode();
  }

  async addMark({ mark, comment }) {
    const { answerId } = this.state;
    await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `mutation addMark($mark: Float, $comment: String, $answerId: String) {
          addMark(
            mark: $mark,
            comment: $comment,
            answerId: $answerId,
          ) {
            id
          }
        }`,
        variables: {
          mark,
          comment,
          answerId,
        },
      }),
    });
  }

  async retrieveAnswer() {
    const { user, course, unit } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: `query retireve(
          $courseIds: [String],
          $unitIds: [String],
          $userIds: [String])
        {
          courses (ids:$courseIds) {
            units (ids:$unitIds) {
              answers (userIds: $userIds) {
                id,
                body
                marks { id, mark, comment, createdAt }
                user {
                  id,
                  profile { displayName }
                }
                createdAt
              }
            }
          }
        }`,
        variables: {
          userIds: (!user.isAdmin && [user.id]) || null,
          unitIds: [unit.id],
          courseIds: [course.id],
        },
      }),
    });
    const { data } = await resp.json();
    const { answers } = data.courses[0].units[0];
    if (answers && answers.length) {
      const answerCur = 0;
      this.setState({
        answers: answers.map(answer => {
          const ans = answer;
          ans.body = JSON.parse(answer.body);
          return ans;
        }),
        answerId: answers[answerCur].id,
        answer: answers[answerCur].body,
        answerCur,
      });
    }
  }

  render() {
    const { user, role, course, unit } = this.props;
    const {
      title,
      editMode,
      answers,
      answerCur,
      body,
      answerId,
      answer,
    } = this.state;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            <a href={`/courses/${course.id}`}>{course.title}</a>
            /{editMode ? (
              <span>
                <input
                  value={title}
                  type="text"
                  onChange={this.handleChange('title')}
                />
                <IconButton onClick={this.save} glyph="ok" />
                <IconButton
                  onClick={() => {
                    this.setState({
                      editMode: false,
                      title: unit.title,
                      body: unit.body,
                    });
                  }}
                  glyph="remove"
                />
              </span>
            ) : (
              <Fragment>
                <span>
                  {title}
                  {role === 'teacher' && (
                    <IconButton onClick={this.switchMode} glyph="pencil" />
                  )}
                </span>
                <DropdownButton
                  id="answer_chooser"
                  title={`${unit.answers[0].user.profile.displayName} ${
                    unit.answers[0].createdAt
                  }`}
                  onSelect={this.handleAnswerSelect}
                >
                  {user &&
                    user.isAdmin &&
                    answers &&
                    answers.map((ans, i) => (
                      <MenuItem
                        key={ans.id}
                        eventKey={i}
                        active={i === answerCur}
                      >
                        {`${ans.user.profile.displayName} ${ans.createdAt}`}
                      </MenuItem>
                    ))}
                </DropdownButton>
              </Fragment>
            )}
          </h1>
          {editMode ? (
            <TextEditor
              value={body}
              onChange={val => this.setState({ body: val })}
            />
          ) : (
            <Fragment>
              <span>
                <UnitView
                  answerId={answerId}
                  value={answer}
                  body={body}
                  onChange={val => this.setState({ answer: val })}
                  onHeadersChange={headers => setUnitHeaders(headers)}
                />
                {user && <Button onClick={this.saveAnswer}>Save</Button>}
              </span>
              <MarksTable
                // TODO: make newly added mark appear ih the table
                marks={unit.answers[0].marks}
                onSubmit={this.addMark}
              />
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
});

export default connect(
  mapStateToProps,
  { setUnitHeaders },
)(withStyles(s)(Unit));
