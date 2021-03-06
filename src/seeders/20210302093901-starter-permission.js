'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const permission = [
        "category-read",
        "category-add",
        "category-edit",
        "category-delete",
        "product-read",
        "product-add",
        "product-edit",
        "product-delete",
        "user-read",
        "user-add",
        "user-edit",
        "user-delete",
        "access_control-manage",
      ];
      await queryInterface.bulkInsert('permission', permission.map((v) => ({ permission: v })));
    } catch (err) {
      console.log(err);
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permission', {});
  }
};
