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

// external-global styles must be imported in your JS.
import normalizeCss from 'normalize.css';
import s from './Layout.css';
import Header from '../Header';
import Footer from '../Footer';

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
  };

  static defaultProps = {
    menuSecond: [],
  };

  render() {
    const menuSecondList = [];
    const items = this.props.menuSecond;
    for (let i = 0; i < items.length; i += 1) {
      const secondLevel = [];
      for (let j = 0; j < items[i].length; j += 1) {
        secondLevel.push(
          <li
            key={`${i} ${j}`}
            className={items[i][j].isActive ? s.active : null}
          >
            <a href={items[i][j].action}>
              {items[i][j].title}
              {s.active ? (
                <span className="sr-only">(current)</span>
              ) : (
                undefined
              )}
            </a>
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

export default withStyles(normalizeCss, s)(Layout);
