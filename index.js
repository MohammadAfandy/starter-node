const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { port } = require("./src/config");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

// add custom global function
Object.assign(global, require("./src/utils/functions"));

// add custom error exception
Object.assign(global, require("./src/utils/error"));

// add custom express response function
require("./src/utils/response")(app);

// main routes
app.use("/api", require("./src/routes"))

// not found handler
app.use((req, res, next) => res.notFound());

// error handler
app.use((err, req, res, next) => res.error(err, err.message, err.status_code, err.data));

// run app
app.listen(port, () => console.log(`Server running on Port ${port}`));