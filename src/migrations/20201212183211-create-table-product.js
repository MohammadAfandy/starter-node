'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING
      },
      category_id: {
        type: Sequelize.INTEGER,
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
      queryInterface.addIndex('product', ['code'], { name: 'idx_product_code' });
      queryInterface.addIndex('product', ['name'], { name: 'idx_product_name' });
      queryInterface.addConstraint('product', {
        fields: ['category_id'],
        type: 'foreign key',
        name: 'fk_product_category_id',
        references: {
          table: 'category',
          field: 'id'
        },
      });
      queryInterface.addIndex('product', ['created_at'], { name: 'idx_product_created_at' });
      queryInterface.addIndex('product', ['deleted_at'], { name: 'idx_product_deleted_at' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product');
  }
};
