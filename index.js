const express = require("express");
const app = express();
const { rootPath, staticPath, port } = require("./src/config");

// add custom global function
Object.assign(global, require("./src/utils/functions"));

// add custom error exception
Object.assign(global, appRequire("utils", "error"));

// init cache
const myCache = appRequire("utils", "cache");
myCache.init();

// add global middlewares
const middlewares = appRequire("middlewares");
if (middlewares.length) app.use(...middlewares);

// static path
for (let i in staticPath) {
  app.use(staticPath[i], express.static(rootPath + staticPath[i]));
}

// main routes
app.use("/api", require("./src/routes"))

// not found handler
app.use((req, res, next) => {
  throw new NotFoundError();
});

// error handler
app.use((err, req, res, next) => res.error(err));

// run app
app.listen(port, () => console.log(`Server running on Port ${port}`));
