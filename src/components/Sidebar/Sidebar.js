import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import { Col } from 'react-bootstrap';
import s from './Sidebar.css';
import Link from '../Link';

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
    }),
  };

  static defaultProps = {
    secondMenu: {},
  };

  static contextTypes = {
    pathname: PropTypes.any.isRequired,
  };

  renderSecondMenu(name) {
    const { pathname } = this.context;
    const { secondMenu } = this.props;
    const menu = secondMenu[name].map(item => (
      <li
        key={item.id}
        className={pathname === item.link ? 'active' : undefined}
      >
        <Link to={item.link}>{item.title}</Link>
      </li>
    ));
    return (
      <ul key={name} className="nav nav-pills nav-stacked">
        {menu}
      </ul>
    );
  }

  render() {
    const menuSecondList = [];
    const { secondMenu } = this.props;

    for (let i = 0; i < menuSecondOrder.length; i += 1) {
      const name = menuSecondOrder[i];
      if (secondMenu[name] && secondMenu[name].length) {
        menuSecondList.push(this.renderSecondMenu(name));
      }
    }
    return (
      <Col sm={3} md={2} className={s.sidebar}>
        {menuSecondList}
      </Col>
    );
  }
}

const mapStateToProps = state => ({
  secondMenu: state.secondMenu || [],
});

export default connect(mapStateToProps)(withStyles(s)(Sidebar));
