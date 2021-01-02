'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('token', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      access_token: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      device: {
        type: Sequelize.STRING,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            key: 'id',
          },
        },
      },
      description: {
        type: Sequelize.STRING
      },
      access_token_expired_at: {
        type: Sequelize.DATE,
      },
      refresh_token_expired_at: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    }).then(() => {
      queryInterface.addIndex('token', ['access_token'], { name: 'idx_token_access_token' });
      queryInterface.addIndex('token', ['refresh_token'], { name: 'idx_token_refresh_token' });
      queryInterface.addIndex('token', ['device'], { name: 'idx_token_device' });
      queryInterface.addIndex('token', ['user_id'], { name: 'idx_token_user_id' });
      queryInterface.addIndex('token', ['created_at'], { name: 'idx_token_created_at' });
      queryInterface.addIndex('token', ['access_token_expired_at'], { name: 'idx_token_access_token_expired_at' });
      queryInterface.addIndex('token', ['refresh_token_expired_at'], { name: 'idx_token_refresh_token_expired_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('token');
  }
};
