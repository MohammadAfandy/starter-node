module.exports = (sequelize, Sequelize, options) => {
  const model = sequelize.define("role", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING
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