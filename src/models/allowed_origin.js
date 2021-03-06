const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class AllowedOrigin extends BaseModel {

  }

  AllowedOrigin.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    origin: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    // deleted_at: {
    //   type: Sequelize.DATE,
    // },
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
    modelName: 'allowed_origin',
    ...options,
  });

  return AllowedOrigin;
};
