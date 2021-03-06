exports.ucfirst = (str, separator = " ") => {
  return str.split(separator).map(v => v.charAt(0).toUpperCase() + v.slice(1)).join(" ");
}

exports.padLeft = (str, padChar = "0", length = 4) => {
  str = "" + str
  padChar = "" + padChar;
  pad = padChar.repeat(length);
  return pad.substring(0, pad.length - str.length) + str;
}
