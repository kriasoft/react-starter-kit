module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('file', 'parentType');
    await queryInterface.removeColumn('file', 'parentId');
    await queryInterface.createTable('fileParent', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      parentType: Sequelize.STRING,
      parentId: Sequelize.UUID,
      key: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      fileId: Sequelize.UUID,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('file', 'parentType', Sequelize.STRING);
    await queryInterface.addColumn('file', 'parentId', Sequelize.UUID);
    await queryInterface.dropTable('fileParent');
  },
};
