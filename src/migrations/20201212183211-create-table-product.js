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
        references: {
          model: {
            tableName: 'category',
            key: 'id',
          },
        },
      },
      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
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
      queryInterface.addIndex('product', ['code'], { name: 'idx_product_code' });
      queryInterface.addIndex('product', ['name'], { name: 'idx_product_name' });
      queryInterface.addIndex('product', ['status'], { name: 'idx_product_status' });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product');
  }
};
