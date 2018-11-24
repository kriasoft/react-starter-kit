import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, Table } from 'react-bootstrap';
import moment from 'moment';
import IconButton from '../IconButton/IconButton';
import { createMark } from '../../actions/units';

class MarksTable extends Component {
  static propTypes = {
    answer: PropTypes.shape({
      id: PropTypes.string.isRequired,
      marks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          mark: PropTypes.number.isRequired,
          comment: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
        }),
      ).isRequired,
    }).isRequired,
    createMark: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      mark: '',
      comment: '',
    };
  }

  getValidationState() {
    const { mark } = this.state;
    if (mark < 0 || mark > 100) return 'error';
    else if (mark > 0) return 'success';
    return null;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.createMark({ ...this.state, answerId: this.props.answer.id });
  };

  handleChange = name => ({ target: { value } }) =>
    this.setState({
      [name]: value,
    });

  render() {
    const { mark, comment } = this.state;
    const { answer } = this.props;
    const { marks } = answer;

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
              {marks.map((m, index) => (
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
              ))}
              {!marks.length && (
                <tr>
                  <td colSpan="4">
                    <span>No marks yet</span>
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
  answer: state.answer,
});

export default connect(
  mapStateToProps,
  { createMark },
)(MarksTable);
