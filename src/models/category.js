const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class Category extends BaseModel {
    
  }

  Category.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING
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
    modelName: 'category',
    ...options,
  });

  return Category;
};
