const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class Product extends BaseModel {

  }

  Product.init({
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
    category_id: {
      type: Sequelize.INTEGER,
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
    modelName: 'product',
    ...options,
  });

  return Product;
};
