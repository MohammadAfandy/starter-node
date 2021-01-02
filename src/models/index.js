const Sequelize = require("sequelize");
const { db: dbConfig, logging } = appRequire("config");
const logger = appRequire("config", "logger");
const { logAuditDb } = appRequire("utils", "log");

const myLogging = (queryString, queryObject) => {
  logger.info(queryString);
  if (queryObject.bind) logger.info(queryObject.bind);
}

const defaultOptions = {
  timestamps: false,
  freezeTableName: true,
  engine: 'InnoDB',
  charset: 'utf8',
  hooks: {
    beforeUpdate: instance => instance.updated_at = new Date(),
  }
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
  define: defaultOptions,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;;

let additionalOptions = {};

if (logging.auditDb) {
  /** ============ start logging every CRUD operation ============
   * individualHooks must set to true when updating / deleting instance
   */
  if (!additionalOptions.hooks) additionalOptions.hooks = {};
  additionalOptions.hooks["afterCreate"] = instance => logAuditDb(instance, "create");
  additionalOptions.hooks["afterUpdate"] = instance => logAuditDb(instance, "update");
  additionalOptions.hooks["afterDestroy"] = instance => logAuditDb(instance, "delete");
  /** ============ end logging every CRUD operation ============ **/
}

// ========================== MODEL ASSIGNMENT ==========================

// list of model that doesn't use default options
db.log_audit_db = appRequire("models", "log_audit_db")(sequelize, Sequelize);
db.log_request = appRequire("models", "log_request")(sequelize, Sequelize);

db.user = appRequire("models", "user")(sequelize, Sequelize, additionalOptions);
db.role = appRequire("models", "role")(sequelize, Sequelize, additionalOptions);
db.user_role = appRequire("models", "user_role")(sequelize, Sequelize, additionalOptions);
db.token = appRequire("models", "token")(sequelize, Sequelize, additionalOptions);
db.category = appRequire("models", "category")(sequelize, Sequelize, additionalOptions);
db.product = appRequire("models", "product")(sequelize, Sequelize, additionalOptions);

// ========================== MODEL RELATIONS ==========================
db.user.belongsToMany(db.role, { through: db.user_role, foreignKey: "user_id", otherKey: "role_id" });
db.role.belongsToMany(db.user, { through: db.user_role, foreignKey: "role_id", otherKey: "user_id" });
db.user.hasMany(db.token, { foreignKey: "user_id" });
db.token.belongsTo(db.user, { foreignKey: "user_id" });
db.category.hasMany(db.product, { foreignKey: "category_id" });
db.product.belongsTo(db.category, { foreignKey: "category_id" });

module.exports = db;