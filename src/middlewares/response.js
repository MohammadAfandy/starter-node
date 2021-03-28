const Sequelize = require("sequelize");
const { logging } = appRequire("config");
const config = appRequire("config");
const logger = appRequire("config", "logger");
const { logRequest } = appRequire("utils", "log");
const TelegramApi = appRequire("services", "telegram");

const response = async (req, res, next) => {

  const sendResponse = (response, request) => {
    if (logging.request) logRequest(response.code, req, response);
    if (request.start_time) {
      response.execution_time = `${(new Date()).getTime() - request.start_time} ms`;
    }
    return res.status(response.code).json(response);
  }

  let response = {
    code: "",
    message: "",
    timestamp: new Date().getTime(),
    error: false,
    data: {},
    // version: config.version,
    // path: req.originalUrl,
    // method: req.method,
  }

  res.success = (data, message, code) => {
    response.code = code || 200;
    response.message = message || "Success";
    response.data = data || {};

    logger.http(`${req.originalUrl} - ${response.code} - ${response.message}`);
    sendResponse(response, req);
  }

  res.error = (err) => {
    
    if (err instanceof ValidationError) {
      if (err.data && err.data.length) {
        err.data = err.data.map(v => {
          return {
            param: v.param,
            message: v.msg,
          }
        });
      } else {
        err.data = [{
          param: null,
          message: err.message, 
        }]
      }
    }

    response.code = err.status_code || 500;
    response.message = err.message || "Internal Server Error";
    response.error = err.data || {};

    if (config.debug) {
      response.error.stack = err.stack;
    } else {
      if (response.code >= 500) {
        response.message = "Internal Server Error";
      }
    }

    if (response.code >= 400 && response.code < 500) {
      logger.warn(err);
    } else {
      if (config.telegram.log) {
        TelegramApi.sendLogMessage(req, response);
      }
      logger.error(err);
    }

    sendResponse(response, req);
  }

  next();
};

module.exports = response;