import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import User from '../../components/User';
import s from './Users.css';
import { setGroup, addGroup } from '../../actions/groups';
import IconButton from '../../components/IconButton';
import ModalGroupEdit from '../../components/ModalGroupEdit';
import { showModal } from '../../actions/modals';

class Users extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    user: PropTypes.shape({
      isAdmin: PropTypes.bool,
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
    fetch: PropTypes.func.isRequired,
  };

  render() {
    const { groups, users, user = {} } = this.props;
    const { dispatch } = this.context.store;
    return (
      <div className={s.root}>
        <ModalGroupEdit modalId="modalGroupAdd" edit={false} />
        <ModalGroupEdit modalId="modalGroupEdit" />
        <div className={s.container}>
          <Row>
            <Col md={4}>
              <h1>
                Groups{' '}
                {user.isAdmin && (
                  <IconButton
                    onClick={() => dispatch(showModal('modalGroupAdd'))}
                    glyph="plus"
                  />
                )}
              </h1>
              <ol>
                {groups.map(group => (
                  <li key={group.id}>
                    {group.title}
                    {user.isAdmin && (
                      <IconButton
                        onClick={() => {
                          dispatch(setGroup(group));
                          dispatch(showModal('modalGroupEdit'));
                        }}
                        glyph="pencil"
                      />
                    )}
                  </li>
                ))}
              </ol>
            </Col>
            <Col md={8}>
              <h1>{this.props.title}</h1>
              <ol>
                {users.map(u => (
                  <li key={u.id}>
                    <User user={u} />
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

const mapStateToProps = state => ({
  user: state.user,
  groups: state.groups,
  users: state.users,
  group: state.group,
});

export default connect(
  mapStateToProps,
  { addGroup },
)(withStyles(s)(Users));
