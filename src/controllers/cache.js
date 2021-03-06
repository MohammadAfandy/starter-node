const myCache = appRequire("utils", "cache");

exports.get = (req, res, next) => {
  try {
    let { key } = req.body;
    const list = myCache.list();
    res.success(list.find((v) => v.key == key));
  } catch (error) {
    next(error);
  }
};

exports.delete = (req, res, next) => {
  try {
    let { key } = req.body;
    const cache = myCache.del(key);
    res.success(cache);
  } catch (error) {
    next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    myCache.flushAll();
    await myCache.init();
    res.success(myCache.list());
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.success(myCache.list());
  } catch (error) {
    next(error);
  }
};
