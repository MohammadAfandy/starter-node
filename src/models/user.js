const { baseUrl } = appRequire("config");

module.exports = (sequelize, Sequelize, options) => {
  const model = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(),
      allowNull: false,
    },
    phone_number: {
      type: Sequelize.STRING(30),
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image_path: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM("ACTIVE", "INACTIVE", "BANNED"),
      defaultValue: "ACTIVE",
    },
    actived_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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
  }, options);

  model.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    values.image_path = values.image_path && (baseUrl + "/uploads/" + values.image_path);
    delete values.password;
    return values;
  };

  return model;
};