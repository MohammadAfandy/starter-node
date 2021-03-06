const helmet = require("helmet");
const bodyParser = require("body-parser");
const responseMiddleware = appRequire("middlewares", "response");
const corsMiddleware = appRequire("middlewares", "cors");
const timeMiddleware = appRequire("middlewares", "time");
const trimMiddleware = appRequire("middlewares", "trim");
const multerMiddleware = appRequire("middlewares", "multer");

module.exports = [
  responseMiddleware, // required (do not remove or change the position)
  timeMiddleware,
  corsMiddleware,
  helmet(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  trimMiddleware,
  multerMiddleware,
  // ... add more middleware function
];
