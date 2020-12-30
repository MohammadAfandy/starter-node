const Sequelize = require("sequelize");
const { db: dbConfig } = appRequire("config");
const logger = appRequire("config", "logger");
const { logAuditDb } = appRequire("utils", "log");

const myLogging = (queryString, queryObject) => {
  logger.info(queryString);
  if (queryObject.bind) logger.info(queryObject.bind);
}


// connect to sequelize
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port || 3306,
  dialect: dbConfig.dialect,
  timezone: dbConfig.timezone,
  logging: dbConfig.logging && myLogging,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// default model options
let options = {
  timestamps: false,
  freezeTableName: true,
  engine: 'InnoDB',
  charset: 'utf8',
  hooks: {
    /** ============ start logging every CRUD operation ============
     * individualHooks must set to true when updating / deleting instance
     * log to mongodb
     */
    afterCreate: (instance, options) => logAuditDb(instance, "create"),
    afterUpdate: (instance, options) => logAuditDb(instance, "update"),
    afterDestroy: (instance, options) => logAuditDb(instance, "delete"),
    /** ============ end logging every CRUD operation ============ **/

    beforeUpdate: (instance, options) => instance.updated_at = new Date(),
  },
};

// ========================== MODEL ASSIGNMENT ==========================

// list of model that doesn't use default options
db.log_audit_db = appRequire("models", "log_audit_db")(sequelize, Sequelize);
db.log_request = appRequire("models", "log_request")(sequelize, Sequelize);

db.user = appRequire("models", "user")(sequelize, Sequelize, options);
db.role = appRequire("models", "role")(sequelize, Sequelize, options);
db.user_role = appRequire("models", "user_role")(sequelize, Sequelize, options);
db.token = appRequire("models", "token")(sequelize, Sequelize, options);
db.category = appRequire("models", "category")(sequelize, Sequelize, options);
db.product = appRequire("models", "product")(sequelize, Sequelize, options);

// ========================== MODEL RELATIONS ==========================
db.user.belongsToMany(db.role, { through: db.user_role, foreignKey: "user_id", otherKey: "role_id" });
db.role.belongsToMany(db.user, { through: db.user_role, foreignKey: "role_id", otherKey: "user_id" });
db.user.hasMany(db.token, { foreignKey: "user_id" });
db.token.belongsTo(db.user, { foreignKey: "user_id" });
db.category.hasMany(db.product, { foreignKey: "category_id" });
db.product.belongsTo(db.category, { foreignKey: "category_id" });

module.exports = db;