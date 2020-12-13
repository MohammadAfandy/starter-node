module.exports = (sequelize, Sequelize, options) => {
  const token = sequelize.define("token", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    access_token: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    refresh_token: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    device: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING
    },
    access_token_expired_at: {
      type: Sequelize.DATE,
    },
    refresh_token_expired_at: {
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

  return token;
};