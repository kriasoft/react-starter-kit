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
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container-fluid">
          <div className="row">
            <div className={`col-sm-3 col-md-2 ${s.sidebar}`}>
              <ul className={`nav ${s['nav-sidebar']}`}>
                <li className={s.active}>
                  <a href="/">
                    Overview <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li>
                  <a href="/">Reports</a>
                </li>
                <li>
                  <a href="/">Analytics</a>
                </li>
                <li>
                  <a href="/">Export</a>
                </li>
              </ul>
              <ul className={`nav ${s['nav-sidebar']}`}>
                <li>
                  <a href="/">Nav item again</a>
                </li>
                <li>
                  <a href="/">One more nav</a>
                </li>
                <li>
                  <a href="/">Another nav item</a>
                </li>
              </ul>
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
