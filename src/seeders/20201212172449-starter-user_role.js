'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      let [user, role] = await Promise.all([
        queryInterface.sequelize.query("SELECT id FROM users ORDER BY id", { type: queryInterface.sequelize.QueryTypes.SELECT }),
        queryInterface.sequelize.query("SELECT id FROM role ORDER BY id", { type: queryInterface.sequelize.QueryTypes.SELECT }),
      ]);
  
      let userRoleData = [];
      for (let i = 0; i < user.length; i++) {
        userRoleData.push({
          user_id: user[i].id,
          role_id: role[i].id,
        })
      }
      await queryInterface.bulkInsert('user_role', userRoleData);
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_role', {});
  }
};
