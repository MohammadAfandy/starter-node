'use strict';
const stringLib = require("../libs/string");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const userData = [{
      username: "superadmin",
      email: "superadmin@testemail.com",
      phone_number: "081212121211",
      password: await stringLib.generatePassword("123456"),
      fullname: "Super Admin",
    }, {
      username: "admin",
      email: "admin@testemail.com",
      phone_number: "081212121212",
      password: await stringLib.generatePassword("123456"),
      fullname: "Admin",
    }];
    await queryInterface.bulkInsert('user', userData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', {});
  }
};
