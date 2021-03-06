const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class LogRequest extends BaseModel {

  }

  LogRequest.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    path: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    method: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    header: {
      type: Sequelize.TEXT,
    },
    body: {
      type: Sequelize.TEXT,
    },
    response: {
      type: Sequelize.TEXT,
    },
    ip_address: {
      type: Sequelize.STRING(30),
    },
    timestamp: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, {
    sequelize,
    modelName: 'log_request',
    ...options,
  });

  return LogRequest;
};
