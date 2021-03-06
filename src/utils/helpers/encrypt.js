const bcrypt = require("bcryptjs");
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

exports.randomString = (bytes) => {
  bytes = bytes || cryptoBytes;
  return crypto.randomBytes(bytes).toString("hex");
}
