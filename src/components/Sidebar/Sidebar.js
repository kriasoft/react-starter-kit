import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { Col, Nav, NavItem } from 'react-bootstrap';
import s from './Sidebar.css';
import Link from '../Link';
import history from '../../history';

const menuSecondOrder = ['unit', 'course'];
class Sidebar extends Component {
  static propTypes = {
    secondMenu: PropTypes.shape({
      unit: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ),
      course: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          link: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
        }),
      ),
    }).isRequired,
  };

  render() {
    const { secondMenu } = this.props;
    return (
      <Col sm={3} md={2} className={s.sidebar}>
        {secondMenu &&
          menuSecondOrder.map(key => (
            <Nav bsStyle="pills" stacked key={key}>
              {secondMenu[key] &&
                secondMenu[key].map(item => (
                  <NavItem
                    componentClass={Link}
                    href={item.link}
                    to={item.link}
                    key={item.id}
                    active={
                      history.location &&
                      history.location.pathname === item.link
                    }
                  >
                    {item.title}
                  </NavItem>
                ))}
            </Nav>
          ))}
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  secondMenu: state.secondMenu || [],
});

export default connect(mapStateToProps)(withStyles(s)(Sidebar));
