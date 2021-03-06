'use strict';
const helper = require("../utils/helpers");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const userData = [{
        username: "superadmin",
        email: "superadmin@testemail.com",
        phone_number: "081212121211",
        password: await helper.encrypt.generatePassword("123456"),
        fullname: "Super Admin",
        created_at: new Date(),
      }, {
        username: "admin",
        email: "admin@testemail.com",
        phone_number: "081212121212",
        password: await helper.encrypt.generatePassword("123456"),
        fullname: "Admin",
        created_at: new Date(),
      }, {
        username: "user",
        email: "user@testemail.com",
        phone_number: "081212121213",
        password: await helper.encrypt.generatePassword("123456"),
        fullname: "User",
        created_at: new Date(),
      }];
      await queryInterface.bulkInsert('users', userData);
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {});
  }
};
