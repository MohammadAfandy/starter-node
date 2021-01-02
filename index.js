const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { rootPath, staticPath, port } = require("./src/config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// add custom global function
Object.assign(global, require("./src/utils/functions"));

// add custom error exception
Object.assign(global, require("./src/utils/error"));

// static path
for (let i in staticPath) {
  app.use(staticPath[i], express.static(rootPath + staticPath[i]));
}

// add custom global middlewares
const middlewares = require("./src/middlewares");
if (middlewares.length) app.use(...middlewares);

// main routes
app.use("/api", require("./src/routes"))

// not found handler
app.use((req, res, next) => res.notFound());

// error handler
app.use((err, req, res, next) => res.error(err, err.message, err.status_code, err.data));

// run app
app.listen(port, () => console.log(`Server running on Port ${port}`));