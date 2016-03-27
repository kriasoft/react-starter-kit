export default (sequelize, DataTypes) => sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
}, {
  classMethods: {
    associate({ User, UserLogin, UserClaim, UserProfile }) {
      User.hasMany(UserLogin, { as: 'logins' });
      User.hasMany(UserClaim, { as: 'claims' });
      User.hasOne(UserProfile, { as: 'profile' });
    },
  },
});
