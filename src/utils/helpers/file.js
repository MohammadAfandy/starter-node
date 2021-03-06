const sharp = require("sharp");

const compressImage = async (file, options = {}) => {
  try {
    let resize = {};
    resize.width = options.resize ? options.resize.width : 500;
    resize.height = options.resize ? options.resize.height : null;
    let new_filename = file.filename + "_compressed." + file.extension;
    let compress = await sharp(file.fullpathname)
      .resize(resize.width, resize.height)
      .toFile(file.fulldir + "/" + new_filename);

    return {
      filename: new_filename,
      compress,
    };
  } catch(error) {
    throw new Error(error);
  }
}

exports.compressImage = compressImage;
