const Sequelize = require("sequelize");
const { logging } = appRequire("config");
const config = appRequire("config");
const logger = appRequire("config", "logger");
const { logRequest } = appRequire("utils", "log");

const handleSequelizeError = (err, response) => {
  if (err instanceof Sequelize.ValidationError) {
    response.code = 422;
    response.message = "Validation Error";
    response.error = err.errors.map(v => {
      return {
        key: v.path,
        type: v.type,
      }
    });
  } else if (err instanceof Sequelize.ForeignKeyConstraintError) {
    response.code = 400;
    response.message = "Foreign Key Constraint Error";
    response.error = {};
  } else if (err instanceof Sequelize.UniqueConstraintError) {
    response.code = 400;
    response.message = "Unique Constraint Error";
    response.error = {};
  }

  return response;
};

const handleValidationError = (err, response) => {
  if (err instanceof ValidationError) {
    response.code = 422;
    response.message = "Validation Error";
    response.error = err.data.map(v => {
      return {
        param: v.param,
        message: v.msg,
      }
    });
  }

  return response;
};

const response = async (req, res, next) => {

  const sendResponse = response => {
    if (logging.request) logRequest(response.code, req, response);
    res.status(response.code).json(response);
  }

  let response = {
    version: config.version,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date(),
    code: "",
    message: "",
  }

  res.success = (data, message, code) => {
    response.code = code || 200;
    response.message = message || "Success";
    response.data = data || {};

    logger.http(`${response.path} - ${response.code} - ${response.message}`);
    sendResponse(response);
  }

  res.notFound = (message) => {
    response.code = 404;
    response.message = message || "Not Found";
    response.error = {};

    logger.info(`${response.path} - ${response.code} - ${response.message}`);
    sendResponse(response);
  }

  res.error = (err, message, code, error) => {
    response = handleSequelizeError(err, response);
    response = handleValidationError(err, response);

    if (response.code == "") {
      response.code = code || err.status_code || 500;
      response.message = message || err.message || "Internal Server Error";
      response.error = error || err.data || {};

      // Don't show 500 error message on production
      if (response.code === 500 && !config.debug) response.message = "Internal Server Error";
    }

    if (response.code >= 400 && response.code < 500) {
      logger.warn(err);
    } else {
      logger.error(err);
    }

    sendResponse(response);
  }

  next();
};

module.exports = response;