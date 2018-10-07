import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, Table } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import IconButton from '../IconButton/IconButton';
import { loadAnswer, createMark } from '../../actions/unit';

class MarksTable extends Component {
  static propTypes = {
    answerId: PropTypes.string.isRequired,
    createMark: PropTypes.func.isRequired,
    loadAnswer: PropTypes.func.isRequired,
    marks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        mark: PropTypes.number.isRequired,
        comment: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mark: '',
      comment: '',
    };
  }

  componentDidMount = async () => {
    const { answerId } = this.props;
    if (answerId) {
      await this.props.loadAnswer(answerId);
    }
  };

  getValidationState() {
    const { mark } = this.state;
    if (mark < 0 || mark > 100) return 'error';
    else if (mark > 0) return 'success';
    return null;
  }

  handleSubmit = e => {
    const { answerId } = this.props;
    e.preventDefault();
    this.props.createMark({ ...this.state, answerId });
  };

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  render() {
    const { mark, comment } = this.state;
    const { marks } = this.props;

    return (
      <Fragment>
        <h3>Marks list</h3>
        <form>
          <Table striped bordered responsive hover>
            <thead>
              <tr>
                <th>№</th>
                <th>Mark</th>
                <th>Comment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {marks.length > 0 ? (
                marks.map((m, index) => (
                  <tr key={m.id}>
                    <td>{index + 1}</td>
                    <td>{m.mark.toFixed(2)}</td>
                    <td>{m.comment}</td>
                    <td>
                      {`${moment(m.createdAt).fromNow()} ( ${moment(
                        m.createdAt,
                      ).format('llll')})`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">
                    <p>No marks yet</p>
                  </td>
                </tr>
              )}
              <tr>
                <td />
                <td>
                  <FormGroup
                    bsClass="mb-0"
                    controlId="mark"
                    validationState={this.getValidationState()}
                  >
                    <FormControl
                      type="number"
                      width="100px"
                      min="0"
                      max="100"
                      step="10"
                      placeholder="Mark from 0 to 100"
                      value={mark}
                      onChange={this.handleChange('mark')}
                    />
                    <FormControl.Feedback />
                  </FormGroup>
                </td>
                <td>
                  <FormControl
                    componentClass="textarea"
                    rows={1}
                    placeholder="Comment"
                    value={comment}
                    onChange={this.handleChange('comment')}
                  />
                </td>
                <td>
                  <IconButton
                    disabled={this.getValidationState() === 'error'}
                    onClick={this.handleSubmit}
                    glyph="ok"
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  marks: state.answer.marks || [],
  answerId: state.unit.answers && state.unit.answers[0].id,
});

export default connect(
  mapStateToProps,
  { createMark, loadAnswer },
)(MarksTable);
