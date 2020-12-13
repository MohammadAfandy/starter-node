'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(30),
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BANNED"),
        defaultValue: "ACTIVE",
      },
      actived_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
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
      queryInterface.addIndex('user', ['username'], { name: 'idx_username' });
      queryInterface.addIndex('user', ['email'], { name: 'idx_email' });
      queryInterface.addIndex('user', ['phone_number'], { name: 'idx_phone_number' });
      queryInterface.addIndex('user', ['status'], { name: 'idx_status' });
      queryInterface.addIndex('user', ['created_at'], { name: 'idx_created_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user');
  }
};
