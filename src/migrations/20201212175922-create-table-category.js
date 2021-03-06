'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('category', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
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
      queryInterface.addIndex('category', ['code'], { name: 'idx_category_code' });
      queryInterface.addIndex('category', ['name'], { name: 'idx_category_name' });
      queryInterface.addIndex('category', ['created_at'], { name: 'idx_category_created_at' });
      queryInterface.addIndex('category', ['deleted_at'], { name: 'idx_category_deleted_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('category');
  }
};
