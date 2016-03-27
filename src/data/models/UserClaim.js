export default (sequelize, DataTypes) => sequelize.define('UserClaim', {
  type: DataTypes.STRING, // 'urn:facebook:access_token'
  value: DataTypes.INTEGER, // profile.id
}, {
  classMethods: {
    associate({ User, UserClaim }) {
      UserClaim.belongsTo(User);
    },
  },
});
