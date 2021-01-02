'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
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
      image_path: {
        type: Sequelize.STRING,
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
      queryInterface.addIndex('users', ['username'], { name: 'idx_user_username' });
      queryInterface.addIndex('users', ['email'], { name: 'idx_user_email' });
      queryInterface.addIndex('users', ['phone_number'], { name: 'idx_user_phone_number' });
      queryInterface.addIndex('users', ['status'], { name: 'idx_user_status' });
      queryInterface.addIndex('users', ['created_at'], { name: 'idx_user_created_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
