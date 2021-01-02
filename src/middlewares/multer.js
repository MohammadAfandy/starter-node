const multer = require("multer");
const { uploadDir, maxFileSize, allowedMimeType } = appRequire("config");

const multerMiddleware = multer({
  dest: uploadDir + "/tmp",
  limits: {
    fileSize: maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (false === allowedMimeType.includes(file.mimetype)) {
      return cb(new BadRequestError(`File Type ${file.mimetype} Not Allowed.`));
    }
    cb(null, true);
  }
}).any();

module.exports = multerMiddleware;