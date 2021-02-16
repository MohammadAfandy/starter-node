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

exports.ucfirst = (str, separator = " ") => {
  return str.split(separator).map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(" ");
}

exports.padLeft = (str, padChar = "0", length = 4) => {
  str = "" + str
  padChar = "" + padChar;
  pad = padChar.repeat(length);
  return pad.substring(0, pad.length - str.length) + str;
}