const { rootPath, uploadDir } = require("../config");
const fs = require("fs");
const moment = require("moment");
const listEndpoints = require('express-list-endpoints');

const appRequire = (moduleName, ...filePath) => {
  const availableModules = [
    "config",
    "controllers",
    "middlewares",
    "models",
    "repositories",
    "routes",
    "services",
    "utils",
    "validators",
  ];
  if (availableModules.indexOf(moduleName) <= -1) throw new Error(`Module '${moduleName}' not available`);

  let path = `${rootPath}/src/${moduleName}/${filePath.join('/')}`;

  return require(path);
}

const isString = (string) => typeof string === "string";

const isArray = (array) => Array.isArray(array)

const isObject = (object) => Object.prototype.toString.call(object) === "[object Object]";

const getIpAddress = (req) => {
  let ip = req.headers["x-forwarded-for"];
  if (!ip) ip = req.connection.remoteAddress;
  if (!ip) ip = req.socket.remoteAddres;
  if (!ip) ip = (req.connection.socket ? req.connection.socket.remoteAddress : null);

  return ip || null;
}

const makeDir = (dir) => {
  let process;
  if (!fs.existsSync(dir)) {
    process = fs.mkdirSync(dir, { recursive: true })
  };

  return process
}

const moveUploadedFile = (files, fieldName, destination, newFileName, withTimeStamp = true) => {
  return new Promise((resolve, reject) => {
    const file = files.filter(v => v.fieldname === fieldName)[0];
    if (!file) reject(new Error("Invalid req.files fieldname"));

    const type = file.mimetype.split("/")[0];
    const now = new Date();
    const curDate = moment(now).format("YYYY-MM-DD");
    let newUploadDir = "";
    if (destination) {
      newUploadDir = destination;
    } else {
      newUploadDir = type + "/" + curDate;
    }
    const newFullUploadDir = uploadDir + "/" + newUploadDir;
    let filename = "";
    if (newFileName) {
      filename = newFileName;
    } else {
      filename = file.originalname.split('.').slice(0, -1).join('.');
    }
    if (withTimeStamp) {
      filename += "_" + Math.round(now.getTime() / 1000);
    }
    const extension = file.originalname.split('.').pop();
    const fullname =  filename + "." + extension;
    makeDir(newFullUploadDir);

    const newDest = newFullUploadDir + "/" + fullname;
    const source = fs.createReadStream(file.path);
    const dest = fs.createWriteStream(newDest);

    const res = {
      fulldir: newFullUploadDir,
      dir: newUploadDir,
      filename: filename,
      extension: extension,
      fullname: fullname,
      fullpathname: newDest,
    }

    source.pipe(dest);
    source.on("end", () => resolve(res));
    source.on("error", (err) => reject(new Error(err)));
  }
)};

const fancyLog = (log) => {
  console.log('\x1b[35m%s\x1b[0m', '=========================================================================================');
  console.log(Object.keys({log})[0] + ' ==> ', log);
  console.log('\x1b[35m%s\x1b[0m', '=========================================================================================');
}

const getAllRoutes = () => {
  const routes = listEndpoints(APP);
  let res = [];
  for (let route of routes) {
    for (let method of route.methods) {
      res.push({
        route: route.path,
        method,
      })
    }
  }
  return res;
}

exports.appRequire = appRequire;
exports.isString = isString;
exports.isArray = isArray;
exports.isObject = isObject;
exports.getIpAddress = getIpAddress;
exports.makeDir = makeDir;
exports.moveUploadedFile = moveUploadedFile;
exports.fancyLog = fancyLog;
exports.getAllRoutes = getAllRoutes;
