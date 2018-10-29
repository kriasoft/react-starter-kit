import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Grid,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Button,
  DropdownButton,
  ButtonGroup,
  MenuItem,
} from 'react-bootstrap';
import { subscribeUser, unsubscribeUser } from '../../actions/courses';
import { fetchUsers } from '../../actions/users';

class CourseUsers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    subscribers: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.string,
      }),
    ).isRequired,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(fetchUsers());
  }

  render() {
    const { subscribers, users, dispatch } = this.props;
    const unsubscribed = users.filter(
      ({ id }) => !subscribers.find(user => user.id === id),
    );

    return (
      <Grid fluid>
        <Row>
          <Col md={6}>
            <ListGroup>
              <ListGroupItem header="Unsubscribed" />
              {unsubscribed.map(({ id, email }) => (
                <ListGroupItem key={id}>
                  <ButtonGroup>
                    <Button
                      onClick={() => dispatch(subscribeUser(id))}
                      bsStyle="default"
                    >
                      {email}
                    </Button>
                    <DropdownButton id="role-chooser" title="Role">
                      <MenuItem
                        eventKey="1"
                        onClick={() => dispatch(subscribeUser(id))}
                      >
                        Student
                      </MenuItem>
                      <MenuItem
                        eventKey="2"
                        onClick={() => dispatch(subscribeUser(id, 'teacher'))}
                      >
                        Teacher
                      </MenuItem>
                    </DropdownButton>
                  </ButtonGroup>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col md={6}>
            <ListGroup>
              <ListGroupItem header="Subscribed" />
              {subscribers.map(({ id, email, role }) => (
                <ListGroupItem
                  key={id}
                  onClick={() => dispatch(unsubscribeUser(id))}
                >
                  {`${email} (${role})`}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  subscribers: state.course.users,
  user: state.user,
  users: state.users,
});

export default connect(mapStateToProps)(CourseUsers);
