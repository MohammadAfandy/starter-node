'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
  
      // Timestamps
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }).then(() => {
      queryInterface.addIndex('role', ['role_name'], { name: 'idx_role_role_name' });
      queryInterface.addIndex('role', ['created_at'], { name: 'idx_role_created_at' });
      queryInterface.addIndex('role', ['deleted_at'], { name: 'idx_role_deleted_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role');
  }
};
