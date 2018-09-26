import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Row, Col } from 'react-bootstrap';
import s from './CourseMarks.css';
import AnswerList from './AnswerList';

class CourseMarks extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      studyEntities: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          title: PropTypes.string,
          answers: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string,
              marks: PropTypes.arrayOf(
                PropTypes.shape({
                  createdAt: PropTypes.string,
                  id: PropTypes.string,
                  mark: PropTypes.float,
                }),
              ),
            }),
          ),
        }),
      ),
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };
  render() {
    const { studyEntities } = this.props.course;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <h2>Marks of {this.props.course.title}:</h2>
            <Col xs={12} md={10}>
              <ol>
                {studyEntities.map(ent => (
                  <li>
                    <AnswerList studyEntity={ent} />
                  </li>
                ))}
              </ol>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CourseMarks);
