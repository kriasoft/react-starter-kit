/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { connect } from 'react-redux';
import bootstrap from 'bootstrap/dist/css/bootstrap.css';

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';
import Link from '../Link';

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    menuSecond: PropTypes.arrayOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          action: PropTypes.string,
          isActive: PropTypes.bool,
        }),
      ),
    ),
    secondMenu: PropTypes.arrayOf(PropTypes.any).isRequired,
  };

  static contextTypes = {
    store: PropTypes.any.isRequired,
  };

  static defaultProps = {
    menuSecond: [],
  };

  static menuSecondOrder = ['unit'];

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const menuSecondList = [];
    const items = this.props.menuSecond;
    for (let i = 0; i < Layout.menuSecondOrder.length; i += 1) {
      const m = Layout.menuSecondOrder[i];
      const secondLevel = (this.props.secondMenu[m] || [])
        .filter(menuItem => menuItem.level === 2)
        .map(menuItem => (
          <li key={menuItem.id}>
            <Link to={menuItem.link}>{menuItem.title}</Link>
          </li>
        ));
      menuSecondList.push(
        <ul className={`nav ${s['nav-sidebar']}`}>{secondLevel}</ul>,
      );
    }

    for (let i = 0; i < items.length; i += 1) {
      const secondLevel = [];
      for (let j = 0; j < items[i].length; j += 1) {
        secondLevel.push(
          <li
            key={`${i} ${j}`}
            className={items[i][j].isActive ? s.active : null}
          >
            <Link to={items[i][j].action}>
              {items[i][j].title}
              {s.active ? (
                <span className="sr-only">(current)</span>
              ) : (
                undefined
              )}
            </Link>
          </li>,
        );
      }
      menuSecondList.push(
        <ul key={i} className={`nav ${s['nav-sidebar']}`}>
          {secondLevel}
        </ul>,
      );
    }
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className={`col-sm-3 col-md-2 ${s.sidebar}`}>
              {menuSecondList}
            </div>
            <div
              className={`col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 ${
                s.main
              }`}
            >
              {this.props.children}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  secondMenu: state.secondMenu || [],
});

export default connect(mapStateToProps)(
  withStyles(normalizeCss, bootstrap, s)(Layout),
);
