const { rootPath } = require("../config");
const fs = require("fs");

global.appRequire = (moduleName, fileName = "index") => {
  const availableModule = [
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
  if (availableModule.indexOf(moduleName) <= -1) throw new Error(`Module '${moduleName}' not available`);

  let path = `${rootPath}/src/${moduleName}/${fileName}`;

  if (fileName.substring(fileName.length - 3) !== ".js") {
    path += ".js";
  }

  if (!fs.existsSync(path)) {
    throw new Error(`Module '${moduleName}' with file '${fileName}' not fouund`);
  }

  return require(path);
}

exports.appRequire = appRequire;