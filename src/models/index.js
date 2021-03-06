const Sequelize = require("sequelize");
const { db: dbConfig, logging } = appRequire("config");
const logger = appRequire("config", "logger");
const { logAuditDb } = appRequire("utils", "log");

const myLogging = (queryString, queryObject) => {
  let logMsg = queryString;
  if (queryObject.bind) logMsg += ("Bind: (" + queryObject.bind + ")");
  logger.info(logMsg);
}

const defaultOptions = {
  engine: 'InnoDB',
  charset: 'utf8',
  underscored: true,
  freezeTableName: true,
  timestamps: false,
  paranoid: false,
  // hooks: {
  //   beforeUpdate: instance => instance.updated_at = new Date(),
  // }
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

// https://github.com/sequelize/sequelize/issues/9481
// sequelize.addHook('beforeCount', function (options) {
//   if (this._scope.include && this._scope.include.length > 0) {
//     options.distinct = true
//     options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`
//   }

//   if (options.include && options.include.length > 0) {
//     options.include = null
//   }
// });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;;

let withHooks = {};
let withTimestamps = {
  timestamps: true,
};
let withParanoid = {
  paranoid: true,
};

if (logging.auditDb) {
  /** ============ start logging every CRUD operation ============
   * individualHooks must set to true when updating / deleting instance
   */
  let hooks = {};
  hooks.afterCreate = (instance) => logAuditDb(instance, "create");
  hooks.afterBulkCreate = (instance) => logAuditDb(instance, "create");
  hooks.afterUpdate = (instance) => logAuditDb(instance, "update");
  hooks.afterDestroy = (instance) => logAuditDb(instance, "delete");
  /** ============ end logging every CRUD operation ============ **/

  withHooks = hooks;
}

// ========================== START MODEL ASSIGNMENT ==========================

db.log_audit_db = appRequire("models", "log_audit_db")(sequelize, Sequelize);
db.log_request = appRequire("models", "log_request")(sequelize, Sequelize);

db.user_role = appRequire("models", "user_role")(sequelize, Sequelize, { ...withHooks });
db.role_permission = appRequire("models", "role_permission")(sequelize, Sequelize, { ...withHooks });

// list of model that use timestamp (created_at and updated_at)
db.token = appRequire("models", "token")(sequelize, Sequelize, { ...withHooks, ...withTimestamps });
db.calendar = appRequire("models", "calendar")(sequelize, Sequelize, { ...withHooks, ...withTimestamps });

// list of model that use timestamp (created_at and updated_at) and soft deletion (deleted_at)
db.allowed_origin = appRequire("models", "allowed_origin")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });
db.user = appRequire("models", "user")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });
db.role = appRequire("models", "role")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });
db.permission = appRequire("models", "permission")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });
db.category = appRequire("models", "category")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });
db.product = appRequire("models", "product")(sequelize, Sequelize, { ...withHooks, ...withTimestamps, ...withParanoid });

// ========================== END MODEL ASSIGNMENT ==========================


// ========================== START MODEL RELATIONS ==========================

db.user.belongsToMany(db.role, { through: db.user_role, foreignKey: "user_id", otherKey: "role_id" });
db.role.belongsToMany(db.user, { through: db.user_role, foreignKey: "role_id", otherKey: "user_id" });
db.role.belongsToMany(db.permission, { through: db.role_permission, foreignKey: "role_id", otherKey: "permission" });
db.permission.belongsToMany(db.role, { through: db.role_permission, foreignKey: "permission", otherKey: "role_id" });
db.user.hasMany(db.token, { foreignKey: "user_id" });
db.token.belongsTo(db.user, { foreignKey: "user_id" });
db.category.hasMany(db.product, { foreignKey: "category_id" });
db.product.belongsTo(db.category, { foreignKey: "category_id" });

// ========================== END MODEL RELATIONS ==========================
module.exports = db;
