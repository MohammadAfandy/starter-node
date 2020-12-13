const bcrypt = require("bcrypt");
const crypto = require("crypto");
const saltRounds = 10;
const cryptoBytes = 32;

exports.generatePassword = async (password) => {
  let hashedPassword = bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

exports.checkPasswordValid = async (password, hashedPassword) => {
  let check = await bcrypt.compare(password, hashedPassword);
  return check;
}

exports.generateToken = () => {
  return crypto.randomBytes(cryptoBytes).toString("hex");
}