/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { JsonTable } from 'react-json-table';
import s from './Table.css';

class Table extends React.Component {
  render() {
    const items = [
      { name: 'Louise', age: 27, color: 'red' },
      { name: 'Margaret', age: 15, color: 'blue' },
      { name: 'Lisa', age: 34, color: 'yellow' },
    ];
    return (
      <div className={s.root}>
        <div className={s.container}>
          <JsonTable rows={items} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Table);
