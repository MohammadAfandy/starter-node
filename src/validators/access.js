const { check } = require("express-validator");
const validate = appRequire("validators");

// const index = [
//   check("role_id")
//   .not().isEmpty().withMessage("Role id can not be empty"),
// ];

const assign = [
  check("type")
    .isIn(['access', 'allowed', 'registered']).withMessage("Type must be access/allowed/registered"),
  check("role_id")
    .if(check("type").equals("access"))
    .not().isEmpty().withMessage("Role id can not be empty"),
  check("access")
    .isArray().withMessage("Access must be an array"),
  check("access.*.route")
    .not().isEmpty().withMessage("Route can not be empty"),
  check("access.*.method")
    .not().isEmpty().withMessage("Method can not be empty"),
];

// exports.index = validate(index);
exports.assign = validate(assign);