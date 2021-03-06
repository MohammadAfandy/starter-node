'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const roleData = [{
        role_name: "Super Admin",
        description: "Role for Super Administrating"
      }, {
        role_name: "Admin",
        description: "Role for Administrating"
      }, {
        role_name: "Public",
        description: ""
      }];
      await queryInterface.bulkInsert('role', roleData);
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', {});
  }
};
