'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      let role = await queryInterface.sequelize.query("SELECT id, role_name FROM role ORDER BY id", { type: queryInterface.sequelize.QueryTypes.SELECT });
  
      const admin_permission = [
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
      ];
      const access_permission = ["access_control-manage"];
      const public_permission = [
        "category-read",
        "product-read",
      ];
  
      let rolePermission = [];
  
      for (let i = 0; i < role.length; i++) {
        let temp = [];
        if (role[i].role_name === 'Super Admin') {
          temp = [...admin_permission, ...access_permission].map((v) => ({
            role_id: role[i].id,
            permission: v,
          }));
        } else if (role[i].role_name === 'Admin') {
          temp = admin_permission.map((v) => ({
            role_id: role[i].id,
            permission: v,
          }));
        } else if (role[i].role_name === 'Public') {
          temp = public_permission.map((v) => ({
            role_id: role[i].id,
            permission: v,
          }));
        }
        rolePermission = [...rolePermission, ...temp];
      }
      await queryInterface.bulkInsert('role_permission', rolePermission);
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role_permission', {});
  }
};
