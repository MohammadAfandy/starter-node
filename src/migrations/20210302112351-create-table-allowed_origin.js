'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('allowed_origin', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      origin: {
        type: Sequelize.STRING(100),
        allowNull: false,
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
      queryInterface.addIndex('allowed_origin', ['origin'], { name: 'idx_origin_origin' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('allowed_origin');
  }
};
