const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class User extends BaseModel {
    toJSON () {
      // hide protected fields
      let attributes = Object.assign({}, this.get());
      delete attributes['password'];
      return attributes
    }
  }

  User.init({
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
    created_by: {
      type: Sequelize.INTEGER
    },
    updated_by: {
      type: Sequelize.INTEGER
    },
  }, {
    sequelize,
    modelName: 'users',
    ...options,
  });

  return User;
};
