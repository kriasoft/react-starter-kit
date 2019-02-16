module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Course', 'depsBody', Sequelize.TEXT),

  down: queryInterface => queryInterface.removeColumn('Course', 'depsBody'),
};
