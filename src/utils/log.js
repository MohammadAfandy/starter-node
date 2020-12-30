const logger = appRequire("config", "logger");
const MongoConnection = appRequire("config", "mongo")
const { mongo, logging } = appRequire("config");
const mongoConnection = new MongoConnection();

if (mongo.enable) {
  mongoConnection.init();
}

const logAuditDb = async (instance, action) => {
  let process;
  if (logging.auditDb) {
    let primaryKey = instance.constructor.primaryKeyAttributes[0];
    let dataLog = {
      table: instance.constructor.getTableName(),
      action: action,
      primary_field: primaryKey,
      primary_value: instance[primaryKey],
      previous_data: instance._previousDataValues,
      data: instance.dataValues,
      timestamp: new Date(),
    };

    process = await insertLog("log_audit_db", dataLog, instance);
  }

  return process;
}

const logRequest = async (code, request, response) => {
  let process;
  if (logging.request) {
    let dataLog = {
      code: code,
      path: request.originalUrl,
      method: request.method,
      header: request.headers,
      body: request.body,
      response: response,
      timestamp: new Date(),
    };

    process = await insertLog("log_request", dataLog);
  }

  return process;
}

const maskSensitive = obj => {
  const mask_keys = [
    "password",
    "password_confirmation",
    // "otp_code",
    // ...
  ];
  const mask_value = "[masked]";

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === "object") {
        maskSensitive(obj[prop]);
      } else {
        if (mask_keys.includes(prop)) {
          obj[prop] = mask_value;
        }
      }
    }
  }
}

const insertLog = async (type, dataLog, instance) => {
  try {
    // be wise bruh ...
    maskSensitive(dataLog);

    let insertLog;
    if (logging.dialect === "sql") {
      // convert json object to string for sql database
      Object.keys(dataLog).map(v => {
        if (isArray(dataLog[v]) || isObject(dataLog[v])) {
          dataLog[v] = JSON.stringify(dataLog[v]);
        }
      });
      
      if (instance) {
        insertLog = await instance.sequelize.models[type].create(dataLog);
      } else {
        const { log_request } = appRequire("models");
        insertLog = await log_request.create(dataLog);
      }
    } else if (logging.dialect === "mongo") {
      insertLog = await mongoConnection.db.collection(type).insertOne(dataLog);
    }
    return !!insertLog;
  } catch (error) {
    logger.error(error);
  }
}

exports.logAuditDb = logAuditDb;
exports.logRequest = logRequest;