'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permission', {
      permission: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
      },
      description: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_by: {
        type: Sequelize.INTEGER
      },

      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }).then(() => {
      queryInterface.addIndex('permission', ['created_at'], { name: 'idx_permission_created_at' });
      queryInterface.addIndex('permission', ['deleted_at'], { name: 'idx_permission_deleted_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permission');
  }
};
