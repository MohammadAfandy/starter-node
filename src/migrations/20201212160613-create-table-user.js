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
      queryInterface.addIndex('users', ['username'], { name: 'idx_user_username' });
      queryInterface.addIndex('users', ['email'], { name: 'idx_user_email' });
      queryInterface.addIndex('users', ['phone_number'], { name: 'idx_user_phone_number' });
      queryInterface.addIndex('users', ['status'], { name: 'idx_user_status' });
      queryInterface.addIndex('users', ['created_at'], { name: 'idx_user_created_at' });
      queryInterface.addIndex('users', ['deleted_at'], { name: 'idx_user_deleted_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
