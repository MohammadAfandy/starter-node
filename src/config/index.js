const appRoot = require('app-root-path');
require("dotenv").config();

const checkFalsyEnv = (value) => {
  if (value && value.toLowerCase() === 'false') {
    return false;
  }
  return true;
}

module.exports = {
  version: process.env.VERSION,
  appName: process.env.APPNAME,
  rootPath: appRoot,
  accessTokenLifeTime: process.env.ACCESS_TOKEN_LIFETIME,
  refreshTokenLifeTime: process.env.REFRESH_TOKEN_LIFETIME,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dbName: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    timezone: process.env.DB_TIMEZONE,
    logging: checkFalsyEnv(process.env.DB_LOG),
  },
  mongo: {
    enable: checkFalsyEnv(process.env.ENABLE_MONGO),
    uri: process.env.MONGO_URI,
    dbName: process.env.MONGO_DBNAME,
  },
  port: process.env.PORT,
  debug: checkFalsyEnv(process.env.DEBUG),
  logging: {
    file: checkFalsyEnv(process.env.APP_FILE_LOG),
    auditDb: checkFalsyEnv(process.env.AUDIT_DB_LOG),
    telegram: {
      status: checkFalsyEnv(process.env.TELEGRAM_LOG),
      token: process.env.TELEGRAM_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    },
  }
}