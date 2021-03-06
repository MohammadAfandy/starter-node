const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class RolePermission extends BaseModel {

  }

  RolePermission.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'role',
          key: 'id',
        },
      },
    },
    permission: {
      type: Sequelize.STRING(100),
      allowNull: false,
      references: {
        model: {
          tableName: 'permission',
          key: 'permission',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'role_permission',
    ...options,
  });

  return RolePermission;
};
