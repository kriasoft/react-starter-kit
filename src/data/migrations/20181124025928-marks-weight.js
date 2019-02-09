module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('courseUnit', 'weight', Sequelize.FLOAT),

  down: queryInterface => queryInterface.removeColumn('courseUnit', 'weight'),
};
