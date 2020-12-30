module.exports = (sequelize, Sequelize, options) => {
  const model = sequelize.define("product", {
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
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
      defaultValue: "ACTIVE",
    },
    deleted_at: {
      type: Sequelize.DATE,
    },
    created_by: {
      type: Sequelize.INTEGER
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_by: {
      type: Sequelize.INTEGER
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  }, { ...options });

  return model;
};