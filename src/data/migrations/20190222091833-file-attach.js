module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('file', 'unitId');
    await queryInterface.removeColumn('file', 'answerId');
    await queryInterface.addColumn('file', 'parentType', Sequelize.STRING);
    await queryInterface.addColumn('file', 'parentId', Sequelize.UUID);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('file', 'unitId', Sequelize.UUID);
    await queryInterface.addColumn('file', 'answerId', Sequelize.UUID);
    await queryInterface.removeColumn('file', 'parentType');
    await queryInterface.removeColumn('file', 'parentId');
  },
};
