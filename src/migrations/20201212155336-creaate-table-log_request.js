'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log_request', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      header: {
        type: Sequelize.TEXT,
      },
      body: {
        type: Sequelize.TEXT,
      },
      response: {
        type: Sequelize.TEXT,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }).then(() => {
      queryInterface.addIndex('log_request', ['code'], { name: 'idx_code' });
      queryInterface.addIndex('log_request', ['path'], { name: 'idx_path' });
      queryInterface.addIndex('log_request', ['timestamp'], { name: 'idx_timestamp' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log_request');
  }
};
