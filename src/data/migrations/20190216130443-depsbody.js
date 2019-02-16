module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('course', 'depsBody', Sequelize.TEXT),

  down: queryInterface => queryInterface.removeColumn('course', 'depsBody'),
};
