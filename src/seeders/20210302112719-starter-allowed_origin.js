'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const data = [
        "http://localhost:3000",
      ];
      await queryInterface.bulkInsert('allowed_origin', data.map((v) => ({ origin: v })));
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('allowed_origin', {});
  }
};
