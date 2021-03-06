const timeMiddleware = (req, res, next) => {
  req.start_time = (new Date()).getTime();
  next();
};

module.exports = timeMiddleware;