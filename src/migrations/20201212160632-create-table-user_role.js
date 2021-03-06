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
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }).then(() => {
      queryInterface.addIndex('user_role', ['user_id'], { name: 'idx_user_user_id' });
      queryInterface.addIndex('user_role', ['role_id'], { name: 'idx_user_role_id' });
      queryInterface.addConstraint('user_role', {
        fields: ['user_id', 'role_id'],
        type: 'unique',
        name: 'idx_user_role_user_id_role_id'
      });
      queryInterface.addConstraint('user_role', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'fk_user_role_user_id',
        references: {
          table: 'users',
          field: 'id'
        },
      });
      queryInterface.addConstraint('user_role', {
        fields: ['role_id'],
        type: 'foreign key',
        name: 'fk_user_role_role_id',
        references: {
          table: 'role',
          field: 'id'
        },
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_role');
  }
};
