const { validationResult } = require('express-validator');

module.exports = (body) => {
  return [
    ...body,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ValidationError("Validation Error", errors.array());
      }
      next();
    },
  ]
}