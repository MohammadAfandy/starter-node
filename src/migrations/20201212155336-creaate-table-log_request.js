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
        type: Sequelize.INTEGER,
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
      ip_address: {
        type: Sequelize.STRING(30),
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }).then(() => {
      queryInterface.addIndex('log_request', ['code'], { name: 'idx_log_request_code' });
      queryInterface.addIndex('log_request', ['path'], { name: 'idx_log_request_path' });
      queryInterface.addIndex('log_request', ['timestamp'], { name: 'idx_log_request_timestamp' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log_request');
  }
};
