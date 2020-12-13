const { validationResult } = require('express-validator');

module.exports = (body) => {
  body = body.map(v => {
    return v.trim().escape();
  });

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