const Sequelize = require("sequelize");
const { db: dbConfig, logging, mongo } = appRequire("config");
const MongoConnection = appRequire("config", "mongo");
const logger = appRequire("config", "logger");
const mongoConnection = new MongoConnection();

const myLogging = (queryString, queryObject) => {
  console.log(queryString);
  if (queryObject.bind) console.log(queryObject.bind);
}

const insertLogMongo = async (instance, type) => {
  if (mongo.enable && logging.auditDb) {
    try {
      let insertLog = await mongoConnection.db.collection("audit_db_log").insertOne({
        model: instance.constructor.getTableName(),
        action: type,
        model_id: instance.id,
        previous_data: instance._previousDataValues,
        data: instance.dataValues,
        timestamp: new Date(),
      });
      return insertLog;
    } catch (error) {
      logger.error(error);
    }
  }
}

// connect to sequelize
const sequelize = new Sequelize(dbConfig.dbName, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
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
    afterCreate: (instance, options) => {
      insertLogMongo(instance, "create");
    },
    afterUpdate: (instance, options) => {
      insertLogMongo(instance, "update");
    },
    afterDestroy: (instance, options) => {
      insertLogMongo(instance, "delete");
    },
    /** ============ end logging every CRUD operation ============ **/

    beforeUpdate: (instance, options) => {
      instance.updated_at = new Date();
    },
  },
};

// ========================== MODEL ASSIGNMENT ==========================
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

if (mongo.enable) {
  mongoConnection.init();
  db.mongoConnection = mongoConnection;
}

module.exports = db;