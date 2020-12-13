const { check } = require("express-validator");
const validate = appRequire("validators");

const create = [
  check('code').not().isEmpty().withMessage('Code can not be empty!'),
  check('name').not().isEmpty().withMessage('Name can not be empty!'),
];

exports.create = validate(create);