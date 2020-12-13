'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleData = [{
      role_name: "Super Admin",
      description: "Role for Super Administrating"
    }, {
      role_name: "Admin",
      description: "Role for Administrating"
    }];
    await queryInterface.bulkInsert('role', roleData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', {});
  }
};
