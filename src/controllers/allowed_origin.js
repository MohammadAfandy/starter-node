const allowedOriginRepo = appRequire("repositories", "allowed_origin");
const myCache = appRequire("utils", "cache");

exports.index = async (req, res, next) => {
  try {
    const { q: search, page, limit, sort } = req.query; 
    const data = await allowedOriginRepo(req).getAll({ search, page, limit, sort });
    res.success(data);
  } catch (error) {
    next(error);
  }
};

exports.store = async (req, res, next) => {
  try {
    const { origin } = req.body;
    let data = await allowedOriginRepo(req).create({ data: { origin } });

    // refresh cache
    myCache.setAllowedOrigin();

    res.success(data);
  } catch (error) {
    next(error)
  }
};

exports.findOne = async (req, res, next) => {
  try {
    let data = await allowedOriginRepo(req).findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Data Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { origin } = req.body;
    const process = await allowedOriginRepo(req).firstAndUpdate({
      where: { id: req.params.id },
      data: { origin }
    });

    // refresh cache
    myCache.setAllowedOrigin();

    res.success(process);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const process = await allowedOriginRepo(req).firstAndDestroy({ where: { id: req.params.id } });
    // refresh cache
    myCache.setAllowedOrigin();

    res.success(process);
  } catch (error) {
    next(error);
  }
};

