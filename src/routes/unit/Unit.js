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
import MarksTable from '../../components/MarksTable';
import ModalEditor from '../../components/ModalEditor';
import UnitView from '../../components/UnitView';
import { setUnitHeaders, createMark } from '../../actions/unit';
import { updateUnit } from '../../actions/units';
import s from './Unit.css';

class Unit extends React.Component {
  static propTypes = {
    setUnitHeaders: PropTypes.func.isRequired,
    updateUnit: PropTypes.func.isRequired,
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
      answerId: null,
      answer: {},
    };
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

  handleToggleEdit = () => {
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
  saveAnswer = async () => {
    const { course, unit } = this.props;
    const answer = await this.postProcessAnswer(this.state.answer);
    if (this.state.answerId) {
      await this.context.fetch('/graphql', {
        body: JSON.stringify({
          query: `mutation update($body: String, $id: String!) {
            updateAnswer(body: $body, id: $id) {
              id
            }
          }
          `,
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
            $body: String!,
            $courseId: String!,
            $unitId: String!
          ){
            createAnswer(
              body: $body,
              courseId: $courseId,
              unitId: $unitId
            ){
              id
            }
          }`,
          variables: {
            body: JSON.stringify(answer),
            courseId: course.id,
            unitId: unit.id,
          },
        }),
      });
    }
  };

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
    const { user, role, unit, course } = this.props;
    const { answers, answerCur, answerId, answer } = this.state;

    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>
            <a href={`/courses/${course.id}`}>{course.title}</a>
            / {unit.title}
            {role === 'teacher' && (
              <ModalEditor
                title={unit.title}
                body={unit.body}
                onCreate={u => this.props.updateUnit({ ...u, id: unit.id })}
              />
            )}
            <DropdownButton
              id="answer_chooser"
              // title={`${unit.answers[0].user.profile.displayName} ${
              //   unit.answers[0].createdAt
              // }`}
              onSelect={this.handleAnswerSelect}
            >
              {user &&
                user.isAdmin &&
                answers &&
                answers.map((ans, i) => (
                  <MenuItem key={ans.id} eventKey={i} active={i === answerCur}>
                    {/* {`
                    ${ans.user.profile.displayName} 
                    ${ans.createdAt}`} */}
                  </MenuItem>
                ))}
            </DropdownButton>
          </h1>
          <Fragment>
            <span>
              <UnitView
                answerId={answerId}
                value={answer}
                body={unit.body}
                onChange={val => this.setState({ answer: val })}
                onHeadersChange={headers => this.props.setUnitHeaders(headers)}
              />
              {user && <Button onClick={this.saveAnswer}>Save</Button>}
            </span>
            {unit.answers[0] ? (
              <MarksTable answerId={answerId} />
            ) : (
              <p>This unit has no answers yet</p>
            )}
          </Fragment>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  unit: state.unit,
  user: state.user,
});

export default connect(
  mapStateToProps,
  { setUnitHeaders, createMark, updateUnit },
)(withStyles(s)(Unit));
