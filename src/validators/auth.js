const { check } = require("express-validator");
const validate = appRequire("validators");

const register = [
  check("username").trim().escape()
    .not().isEmpty().withMessage("Username can not be empty")
    .isLength({ min: 5, max: 30 }).withMessage("Username must be between 5 and 30 characters"),
  check("email").trim().escape()
    .not().isEmpty().withMessage("Password can not be empty")
    .normalizeEmail().isEmail().withMessage("Email not valid"),
  check("phone_number").trim().escape()
    .not().isEmpty().withMessage("Phone Number can not be empty")
    .isLength({ min: 6, max: 20 }).withMessage("Phone Number must be between 6 and 20 characters")
    .isNumeric().withMessage("Phone Number must be numeric"),
  check("password").trim().escape()
    .not().isEmpty().withMessage("Password can not be empty")
    .isLength({ min: 6, max: 20 }).withMessage("Password must be between 6 and 20 characters"),
  check("password_confirmation", "Password Confirmation doesn't match").trim().escape()
    .custom((value, { req }) => value == req.body.password),
  check("fullname").trim().escape()
    .not().isEmpty().withMessage("Fullname can not be empty"),
];

const login = [
  check("credential").trim().escape().not().isEmpty().withMessage("Credential can not be empty"),
  check("password").trim().escape().not().isEmpty().withMessage("Password can not be empty"),
  check("device"),
];

const refresh = [
  check("refresh_token").trim().escape().not().isEmpty().withMessage("Refresh Token can not be empty"),
];

exports.register = validate(register);
exports.login = validate(login);
exports.refresh = validate(refresh);