'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permission', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      permission: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    }).then(() => {
      queryInterface.addIndex('role_permission', ['role_id'], { name: 'idx_role_permission_role_id' });
      queryInterface.addIndex('role_permission', ['permission'], { name: 'idx_role_permission_permission' });
      queryInterface.addConstraint('role_permission', {
        fields: ['role_id', 'permission'],
        type: 'unique',
        name: 'idx_role_permission_role_id_permission'
      });
      queryInterface.addConstraint('role_permission', {
        fields: ['role_id'],
        type: 'foreign key',
        name: 'fk_role_permission_role_id',
        references: {
          table: 'role',
          field: 'id'
        },
      });
      queryInterface.addConstraint('role_permission', {
        fields: ['permission'],
        type: 'foreign key',
        name: 'fk_role_permission_permission',
        references: {
          table: 'permission',
          field: 'permission'
        },
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_permission');
  }
};
