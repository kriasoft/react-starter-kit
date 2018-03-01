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
import ReactTable from 'react-table';
import t from 'react-table/react-table.css';
import s from './Today.css';

class Today extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  render() {
    const data = [
      {
        dish: 'Pizza',
        price: 26,
        location: 99,
      },
      {
        dish: 'Salad',
        price: 31,
        location: 50,
      },
    ];
    const columns = [
      {
        Header: 'Dish',
        accessor: 'dish',
      },
      {
        Header: 'Price Score',
        accessor: 'price',
      },
      {
        Header: 'Location Score',
        accessor: 'location',
      },
    ];
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <div className={t}>
            <ReactTable data={data} columns={columns} />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s, t)(Today);
