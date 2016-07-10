import DataType from 'sequelize';
import Model from '../sequelize';

const UserProfile = Model.define('UserProfile', {

  userId: {
    type: DataType.UUID,
    primaryKey: true,
  },

  displayName: {
    type: DataType.STRING(100),
  },

  picture: {
    type: DataType.STRING(256),
  },

  gender: {
    type: DataType.STRING(50),
  },

  location: {
    type: DataType.STRING(100),
  },

  website: {
    type: DataType.STRING(256),
  },

});

export default UserProfile;
