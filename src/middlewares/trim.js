const trimMiddleware = (req, res, next) => {
  for (let i in req.body) {
    if (isString(req.body[i])) {
      req.body[i] = req.body[i].trim();
    }
  }

  next();
}

module.exports = trimMiddleware;