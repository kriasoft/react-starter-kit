module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('CourseUnit', 'weight', Sequelize.FLOAT),

  down: queryInterface => queryInterface.removeColumn('CourseUnit', 'weight'),
};
