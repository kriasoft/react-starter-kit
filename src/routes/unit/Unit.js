import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, DropdownButton, MenuItem } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import MarksTable from '../../components/MarksTable';
import UnitView from '../../components/UnitView';
import { setAnswer, setAnswerBody } from '../../actions/units';
import { setSecondMenu } from '../../actions/menu';
import updateAnswer from '../../gql/updateAnswer.gql';
import createAnswer from '../../gql/createAnswer.gql';
import retrieveAnswerQuery from '../../gql/retrieveAnswer.gql';
import s from './Unit.css';
import Link from '../../components/Link/Link';
import ModalUnitEdit from '../../components/ModalUnitEdit';
import { showModal } from '../../actions/modals';
import IconButton from '../../components/IconButton';

class Unit extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
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
    answer: PropTypes.shape({
      id: PropTypes.string,
      body: PropTypes.shape,
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

  static getAnswersByUser(answers, userId) {
    const data = {};
    answers.forEach(answer => {
      const { id } = answer.user;
      const ua = data[id] || { user: answer.user, answers: [] };
      data[id] = ua;
      ua.answers.push(answer);
    });
    return {
      users: Object.values(data).map(d => ({
        ...d.user,
        needMark: d.answers.some(ans => !ans.marks.length),
      })),
      answers: (data[userId] || { answers: [] }).answers.map(ans => ({
        ...ans,
        needMark: !ans.marks.length,
      })),
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      answerCur: 0,
      answers: [],
      isSaving: false,
      saveStatus: '',
      saveMassage: '',
    };
  }

  async componentDidMount() {
    const { user } = this.props;
    if (user) {
      await this.retrieveAnswer();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setSecondMenu('unit', []));
  }

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  handleUserSelect = id => {
    const userCur = id;
    this.setState({ userCur, answerCur: undefined });
  };

  handleAnswerSelect = id => {
    const answerCur = id;
    this.setState({ answerCur });
    this.props.dispatch(
      setAnswer(this.state.answers.find(ans => ans.id === answerCur)),
    );
  };

  /**
   * Prepare data for sending
   * @returns {Object} object with body and data fields, where body - Object
   * with answer, data - additional FormData to be sent
   */
  prepareAnswer() {
    const { body } = this.props.answer;
    const files = Object.entries(body).filter(
      ans => ans[1] instanceof window.File,
    );
    const uploadOrder = [];
    const data = [];
    files.forEach(file => {
      uploadOrder.push(file[0]);
      data.push(['upload', file[1]]);
      delete body[file[0]];
    });
    data.unshift(['upload_order', JSON.stringify(uploadOrder)]);
    return { body, data };
  }

  /**
   * Sends prepared data
   * @param {string} query - query for GraphQL (create or update)
   * @param {Object} answer - body of the answer
   * @param {Object} variables - additional varibales for query
   */
  sendAnswer(query, answer, variables) {
    const formData = new FormData();
    formData.append('query', query);
    formData.append(
      'variables',
      JSON.stringify({ ...variables, body: JSON.stringify(answer.body) }),
    );
    answer.data.forEach(d => formData.append(d[0], d[1]));
    return this.context.fetch('/graphql', {
      body: formData,
    });
  }

  /**
   * Generates and sends FormData to the server. Expects that
   * this.props.answers contains Object with fields, some of them may be File
   */
  saveAnswer = async () => {
    const { course, unit } = this.props;
    this.setState({ isSaving: true });
    const answerId = this.props.answer.id;
    const answer = this.prepareAnswer();
    try {
      await this.sendAnswer(
        answerId ? updateAnswer : createAnswer,
        answer,
        answerId ? { id: answerId } : { courseId: course.id, unitId: unit.id },
      );
      this.setState({
        saveStatus: 'success',
        saveMassage: 'save completed successfully',
      });
    } catch (e) {
      this.setState({ saveStatus: 'danger', saveMassage: 'save error' });
    } finally {
      this.setState({ isSaving: false });
    }
  };

  async retrieveAnswer() {
    const { user, course, unit } = this.props;
    const resp = await this.context.fetch('/graphql', {
      body: JSON.stringify({
        query: retrieveAnswerQuery,
        variables: {
          userIds: (!user.isAdmin && [user.id]) || null,
          unitIds: [unit.id],
          courseIds: [course.id],
        },
      }),
    });
    const { data } = await resp.json();
    const { answers = [] } = data.courses[0].units[0];
    if (answers && answers.length) {
      this.setState({
        answers: answers.map(answer => {
          const ans = answer;
          ans.body = JSON.parse(answer.body);
          return ans;
        }),
      });
    }
    this.props.dispatch(setAnswer(answers[0] || { body: {} }));
  }

  render() {
    const { user = {}, role, unit, course, dispatch } = this.props;
    const {
      answers = [],
      userCur,
      answerCur,
      saveStatus,
      saveMassage,
    } = this.state;
    const ua = Unit.getAnswersByUser(answers, userCur);
    const answerUser = ua.users.find(u => u.id === userCur);
    const answer = answers.find(ans => ans.id === answerCur);
    return (
      <div className={s.root}>
        <ModalUnitEdit modalId="modalUnitEdit" />
        <div className={s.container}>
          <h1>
            <Link to={`/courses/${course.id}`}>{course.title}</Link>
            {`/${unit.title}`}
            {role === 'teacher' && (
              <IconButton
                onClick={() => dispatch(showModal('modalUnitEdit'))}
                glyph="pencil"
              />
            )}
            {(role === 'teacher' || user.isAdmin) && (
              <React.Fragment>
                <DropdownButton
                  id="user_chooser"
                  title={
                    (answerUser && answerUser.profile.displayName) || 'User'
                  }
                  onSelect={this.handleUserSelect}
                >
                  {ua.users.map(u => (
                    <MenuItem
                      key={u.id}
                      eventKey={u.id}
                      active={u.id === userCur}
                      className={u.needMark && s['need-mark']}
                    >
                      {u.profile.displayName}
                    </MenuItem>
                  ))}
                </DropdownButton>
                <DropdownButton
                  id="answer_chooser"
                  title={(answer && answer.createdAt) || 'Answer'}
                  onSelect={this.handleAnswerSelect}
                >
                  {ua.answers.map(ans => (
                    <MenuItem
                      key={ans.id}
                      eventKey={ans.id}
                      active={ans.id === answerCur}
                      className={ans.needMark && s['need-mark']}
                    >
                      {ans.createdAt}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </React.Fragment>
            )}
          </h1>
          <UnitView
            answerId={this.props.answer.id}
            value={this.props.answer.body}
            body={unit.body}
            onChange={val => this.props.dispatch(setAnswerBody(val))}
            onHeadersChange={headers =>
              dispatch(
                setSecondMenu('unit', headers.filter(item => item.level === 2)),
              )
            }
          />
          {user && (
            <Button onClick={this.saveAnswer} disabled={this.state.isSaving}>
              Save
            </Button>
          )}
          {saveStatus && <Alert variant={saveStatus}>{saveMassage}</Alert>}
          {unit.answers[0] ? (
            <MarksTable />
          ) : (
            <p>This unit has no answers yet</p>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  unit: state.unit,
  user: state.user,
  answer: state.answer,
});

export default connect(mapStateToProps)(withStyles(s)(Unit));
