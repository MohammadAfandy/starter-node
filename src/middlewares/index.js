const helmet = require("helmet");
const bodyParser = require("body-parser");
const responseMiddleware = appRequire("middlewares", "response");
const corsMiddleware = appRequire("middlewares", "cors");
const trimMiddleware = appRequire("middlewares", "trim");
const multerMiddleware = appRequire("middlewares", "multer");

module.exports = [
  responseMiddleware,
  corsMiddleware,
  helmet(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  trimMiddleware,
  multerMiddleware,
  // ... add more middleware function
];
