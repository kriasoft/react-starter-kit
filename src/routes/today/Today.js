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
import s from './Today.css';

class Today extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <table className={s.table}>
            <tr>
              <td>
                <img
                  className={s.pic}
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg"
                  alt=""
                />
              </td>
            </tr>
            <tr>
              <th>Margherita Pizza</th>
            </tr>
            <tr>
              <td>Picture Here</td>
            </tr>
            <tr>
              <td>Price</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Today);
