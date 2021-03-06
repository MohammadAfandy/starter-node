const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class Permission extends BaseModel {

  }

  Permission.init({
    permission: {
      type: Sequelize.STRING(100),
      allowNull: false,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    // created_at: {
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.NOW,
    // },
    updated_by: {
      type: Sequelize.INTEGER
    },
    // updated_at: {
    //   type: Sequelize.DATE,
    // },
  }, {
    sequelize,
    modelName: 'permission',
    ...options,
  });

  return Permission;
};
