const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class UserRole extends BaseModel {

  }

  UserRole.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'user_role',
    ...options,
  });

  return UserRole;
};
