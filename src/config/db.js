const { db: dbConfig } = require("./index");

module.exports = {
  "host": dbConfig.host,
  "port": dbConfig.port,
  "username": dbConfig.username,
  "password": dbConfig.password,
  "database": dbConfig.dbName,
  "dialect": dbConfig.dialect,
  "migrationStorageTableName": "sequelize_meta",
  "seederStorage": "sequelize",
  "seederStorageTableName": "sequelize_data",
}