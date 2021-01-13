const express = require("express");
const app = express();
const { rootPath, staticPath, port } = require("./src/config");

// add custom global function
Object.assign(global, require("./src/utils/functions"));

// add custom error exception
Object.assign(global, appRequire("utils", "error"));

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
app.use((req, res, next) => res.notFound());

// error handler
app.use((err, req, res, next) => res.error(err, err.message, err.status_code, err.data));

// run app
app.listen(port, () => console.log(`Server running on Port ${port}`));