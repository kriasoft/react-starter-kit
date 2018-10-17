import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Col, Row, Table } from 'react-bootstrap';
import s from './CourseMarks.css';
import AnswerList, { UnitPropType } from './AnswerList';

class UserMarks extends React.Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      units: PropTypes.arrayOf(UnitPropType),
    }).isRequired,
  };
  render() {
    const { units, title } = this.props.course;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Row>
            <h2>Marks of Course {title}</h2>
            <Col xs={12} md={10}>
              <Table>
                <thead>
                  <tr>
                    <th>Unit name</th>
                    <th>Mark</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map(ent => <AnswerList unit={ent} key={ent.id} />)}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(UserMarks);
