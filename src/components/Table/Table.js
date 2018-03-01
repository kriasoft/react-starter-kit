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
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import s from './Table.css';

class Table extends React.Component {
  render() {
    const data = [
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        },
      },
    ];

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Age',
        accessor: 'age',
        Cell: props => <span className="number">{props.value}</span>, // Custom cell components!
      },
      {
        id: 'friendName', // Required because our accessor is not a string
        Header: 'Friend Name',
        accessor: d => d.friend.name, // Custom value accessors!
      },
      // {
      //   Header: props => <span>Friend Age</span>, // Custom header components!
      //   accessor: 'friend.age',
      // },
    ];

    return (
      <div className={s.root}>
        <div className={s.container}>
          <ReactTable data={data} columns={columns} />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Table);
