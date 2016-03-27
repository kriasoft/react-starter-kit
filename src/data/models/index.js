import Sequelize from 'sequelize';
import db from '../../core/db';

const models = {
  User: require('./User').default(db, Sequelize),
  UserLogin: require('./UserLogin').default(db, Sequelize),
  UserClaim: require('./UserClaim').default(db, Sequelize),
  UserProfile: require('./UserProfile').default(db, Sequelize),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

db.sync();

export const User = models.User;
export const UserLogin = models.UserLogin;
export const UserClaim = models.UserClaim;
export const UserProfile = models.UserProfile;
