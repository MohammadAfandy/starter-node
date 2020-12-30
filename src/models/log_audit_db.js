module.exports = (sequelize, Sequelize) => {
  const model = sequelize.define("log_audit_db", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    table: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    action: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    primary_field: {
      type: Sequelize.STRING(100),
    },
    primary_value: {
      type: Sequelize.STRING(100),
    },
    previous_data: {
      type: Sequelize.TEXT,
    },
    data: {
      type: Sequelize.TEXT,
    },
    timestamp: {
      type: Sequelize.NOW,
    },
  }, {
    timestamps: false,
    freezeTableName: true,
    engine: 'InnoDB',
    charset: 'utf8',
  });

  return model;
};
