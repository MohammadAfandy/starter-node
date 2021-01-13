const appRoot = require('app-root-path');
require("dotenv").config();

const checkFalsyEnv = value => {
  if (value && value.toLowerCase() === 'false') {
    return false;
  }
  return true;
}

const handleArrayEnv = value => {
  return value.slice(1,-1)
          .trim()
          .split(",")
          .map(v => v.trim());
}

module.exports = {
  version: process.env.VERSION,
  appName: process.env.APPNAME,
  baseUrl: process.env.BASE_URL,
  rootPath: appRoot,
  allowedOrigin: handleArrayEnv(process.env.ALLOWED_ORIGIN),
  staticPath: ["/uploads", "/public"],
  uploadDir: appRoot + "/uploads",
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedMimeType: [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "video/mp4",
    "application/pdf",
    "application/zip",
    "application/rar",
    // add another allowed file type
  ],
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
    request: checkFalsyEnv(process.env.REQUEST_LOG),
    dialect: process.env.DIALECT_LOG,
    telegram: {
      enable: checkFalsyEnv(process.env.TELEGRAM_LOG),
      token: process.env.TELEGRAM_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    },
  }
}