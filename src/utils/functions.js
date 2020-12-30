const { rootPath } = require("../config");
const fs = require("fs");

const appRequire = (moduleName, fileName = "index") => {
  const availableModules = [
    "config",
    "controllers",
    "libs",
    "middlewares",
    "models",
    "repositories",
    "routes",
    "services",
    "utils",
    "validators",
  ];
  if (availableModules.indexOf(moduleName) <= -1) throw new Error(`Module '${moduleName}' not available`);

  let path = `${rootPath}/src/${moduleName}/${fileName}`;

  if (fileName.substring(fileName.length - 3) !== ".js") {
    path += ".js";
  }

  if (!fs.existsSync(path)) {
    throw new Error(`Module '${moduleName}' with file '${fileName}' not fouund`);
  }

  return require(path);
}

const isArray = (array) => {
  return Array.isArray(array);
}

const isObject = (object) => {
  return (!!object) && (object.constructor === Object);
}

exports.appRequire = appRequire;
exports.isArray = isArray;
exports.isObject = isObject;