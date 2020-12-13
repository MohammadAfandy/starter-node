const winston = require("winston");
const moment = require("moment");
const TelegramLogger = require("winston-telegram");
const { rootPath, logging } = appRequire("config");

const errorFormat = winston.format(info => {
  if (info.message instanceof Error) {
    info.message = { ...info.message, message: info.message.message, stack: info.message.stack }
  }

  if (info instanceof Error) {
    info = { ...info, message: info.message, stack: info.stack }
  }

  return info;
});

const logFormat = winston.format.printf(info => {
  let level = info.level;
  let error = errorFormat(info).options;
  delete error["level"];
  return level + " : " + JSON.stringify(error, null, 4);
});

const options = {
  file: {
    level: 'info',
    filename: `${rootPath}/logs/${moment().format("YYYYMM")}/app_log_${moment().format("YYYY_MM_DD")}.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 20,
    colorize: false,
    silent: !logging.file,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    prettyPrint: true,
    format: winston.format.combine(winston.format.colorize(), logFormat),
  },
  telegram: {
    token: logging.telegram.token,
    chatId: logging.telegram.chatId,
    handleExceptions: true,
    level: "warn",
    silent: !logging.telegram.status,
  }
};

let transports = [
  new winston.transports.File(options.file),
  new winston.transports.Console(options.console),
]

if (logging.telegram.status) {
  transports.push(new TelegramLogger(options.telegram));
}

let logger = new winston.createLogger({
  transports: transports,
  exitOnError: false,
  format: winston.format.combine(
    errorFormat(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json(),
  ),
});

module.exports = logger