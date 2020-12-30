'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('log_audit_db', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      table: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      primary_field: {
        type: Sequelize.STRING(100),
      },
      primary_value: {
        type: Sequelize.STRING(100),
      },
      previous_data: {
        type: Sequelize.TEXT,
      },
      data: {
        type: Sequelize.TEXT,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }).then(() => {
      queryInterface.addIndex('log_audit_db', ['table'], { name: 'idx_table' });
      queryInterface.addIndex('log_audit_db', ['action'], { name: 'idx_action' });
      queryInterface.addIndex('log_audit_db', ['timestamp'], { name: 'idx_timestamp' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('log_audit_db');
  }
};
