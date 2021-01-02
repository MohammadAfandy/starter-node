const trimMiddleware = appRequire("middlewares", "trim");
const multerMiddleware = appRequire("middlewares", "multer");
const responseMiddleware = appRequire("middlewares", "response");

module.exports = [
  responseMiddleware,
  multerMiddleware,
  trimMiddleware,
  // ... add more global middleware function
];