const helmet = require("helmet");
const bodyParser = require("body-parser");
const responseMiddleware = appRequire("middlewares", "response");
const corsMiddleware = appRequire("middlewares", "cors");
const timeMiddleware = appRequire("middlewares", "time");
const trimMiddleware = appRequire("middlewares", "trim");
const multerMiddleware = appRequire("middlewares", "multer");
const Sentry = appRequire("utils", "sentry");

module.exports = {
  // run before app hit route
  pre: [
    responseMiddleware, // required (do not remove or change the position)
    Sentry.Handlers.requestHandler(),
    timeMiddleware,
    corsMiddleware,
    helmet(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    trimMiddleware,
    multerMiddleware,
  ],

  // run after app hit route
  post: [
    Sentry.Handlers.errorHandler(),
  ],
};
