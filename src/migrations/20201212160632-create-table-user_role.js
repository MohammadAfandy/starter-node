'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_role', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'user',
            key: 'id',
          },
        },
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'role',
            key: 'id',
          },
        },
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
      queryInterface.addIndex('user_role', ['user_id'], { name: 'idx_user_id' });
      queryInterface.addIndex('user_role', ['role_id'], { name: 'idx_role_id' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_role');
  }
};
