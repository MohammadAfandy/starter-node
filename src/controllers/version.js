const config = appRequire("config");

exports.index = async (req, res, next) => {
  try {
    res.success({
      app: config.appName,
      version: config.version,
    });
  } catch (error) {
    next(error);
  }
}