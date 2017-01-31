import DataType from 'sequelize';
import Model from '../sequelize';

const GbUcProducts = Model.define('gb_uc_products', {

  nid: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
    primaryKey: true,
  },

  vid: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV1,
  },

  sell_price: {
    type: DataType.DECIMAL,
    defaultValue: false,
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

export default GbUcProducts;
