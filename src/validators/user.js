const { check } = require("express-validator");
const validate = appRequire("validators");

const create = [
  check('username').not().isEmpty().withMessage('Username can not be empty!'),
  check('email').not().isEmpty().withMessage('Email can not be empty!'),
];

exports.create = validate(create);
