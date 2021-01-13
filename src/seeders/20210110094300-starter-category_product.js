'use strict';

const faker = require('faker');
const stringLib = require("../libs/string");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let no = 1;
    const categoryData = [...Array(20)].map(v => {
      return {
        code: "CAT-" + (stringLib.padLeft(no++, "0", 5)),
        name: stringLib.ucfirst(faker.random.word()),
        description: faker.commerce.productDescription(),
        created_at: new Date(),
        created_by: 1,
      };
    });
    await queryInterface.bulkInsert('category', categoryData);

    let categoryIds = await queryInterface.sequelize.query("SELECT id FROM category ORDER BY id", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    no = 1;
    let productData = [];
    for (let categoryId of categoryIds) {
      for (let i = 0; i < 20; i++) {
        productData.push({
          code: "PRD-" + (stringLib.padLeft(no++, "0", 5)),
          name: stringLib.ucfirst(faker.commerce.productName()),
          description: faker.commerce.productDescription(),
          category_id: categoryId.id,
          created_at: new Date(),
          created_by: 1,
        });
      }
    }
    await queryInterface.bulkInsert('product', productData);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('category', {});
  }
};
