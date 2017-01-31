/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';

const Node = Model.define('gb_node', {

  nid: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  vid: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  },

  type: {
    type: DataType.STRING,
    defaultValue: false,
  },

  title: {
    type: DataType.STRING,
    defaultValue: false,
  },

  status: {
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

}, {

  // indexes: [
  //   { fields: ['type'] },
  // ],

  // tablename: 'gb_node',

  // freezeTableName: true,

  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,

});

export default Node;
