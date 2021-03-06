const userRepo = appRequire("repositories", "user");

exports.index = async (req, res, next) => {
  try {
    const { q: search, page, limit, sort } = req.query; 
    const data = await userRepo(req).getAll({ search, page, limit, sort });
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.store = async (req, res, next) => {
  try {
    let data = await userRepo(req).create({ data: req.body });
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    let data = await userRepo(req).findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("User Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    let data = await userRepo(req).findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("user Not Found");

    // validation
    await userRepo(req).validate(req.body, data);

    data = Object.assign(data.dataValues, req.body);
    await userRepo(req).update({ data, where: { id: data.id } })
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    let data = await userRepo(req).findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("User Not Found");

    await userRepo(req).destroy({ where: { id: data.id } });
    res.success(data);
  } catch (error) {
    next(error);
  }
}