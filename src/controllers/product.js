const ProductRepository = appRequire("repositories", "product");

exports.index = async (req, res, next) => {
  try {
    const product = new ProductRepository(req);
    let data = await product.findAll();
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.store = async (req, res, next) => {
  try {
    const product = new ProductRepository(req);
    let data = await product.create({ data: req.body });
    console.log("data", data);
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const product = new ProductRepository(req);
    let data = await product.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Product Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    const product = new ProductRepository(req);
    let data = await product.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("product Not Found")

    Object.assign(data, req.body)
    await product.update({ data, where: { id: data.id } })
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const product = new ProductRepository(req);
    let data = await product.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Product Not Found");

    await product.softDelete({ where: { id: data.id } });
    res.success(data);
  } catch (error) {
    next(error);
  }
}