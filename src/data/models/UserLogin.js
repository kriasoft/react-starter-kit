export default (sequelize, DataTypes) => sequelize.define('UserLogin', {
  name: DataTypes.STRING, // loginName
  key: DataTypes.INTEGER, // profile.id
}, {
  classMethods: {
    associate({ User, UserLogin }) {
      UserLogin.belongsTo(User);
    },
  },
});
