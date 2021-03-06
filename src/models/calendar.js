const BaseModel = appRequire("models", "base");

module.exports = (sequelize, Sequelize, options) => {
  class Calendar extends BaseModel {

  }

  Calendar.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    day_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    day: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    month: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('default', 'holiday', 'leave'),
      allowNull: false,
      defaultValue: 'default',
    },
    is_dayoff: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.STRING,
    },
    created_by: {
      type: Sequelize.INTEGER,
    },
    // created_at: {
    //   type: Sequelize.DATE,
    //   defaultValue: Sequelize.NOW,
    // },
    updated_by: {
      type: Sequelize.INTEGER,
    },
    // updated_at: {
    //   type: Sequelize.DATE,
    // },
  }, {
    sequelize,
    modelName: 'calendar',
    ...options,
  });

  return Calendar;
};
