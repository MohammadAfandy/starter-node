const productRepo = appRequire("repositories", "product");

exports.index = async (req, res, next) => {
  try {
    const { q: search, page, limit, sort } = req.query; 
    const data = await productRepo(req).getAll({ search, page, limit, sort });
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.store = async (req, res, next) => {
  try {
    let data = await productRepo(req).create({ data: req.body });
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    let data = await productRepo(req).findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Product Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    const { code, description, name, category_id } = req.body;
    const process = await productRepo(req).firstAndUpdate({
      where: { id: req.params.id },
      data: { code, description, name, category_id }
    });
    res.success(process);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const process = await productRepo(req).firstAndDestroy({ where: { id: req.params.id } });
    res.success(process);
  } catch (error) {
    next(error);
  }
}
