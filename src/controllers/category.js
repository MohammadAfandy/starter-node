const CategoryRepository = appRequire("repositories", "category");

exports.index = async (req, res, next) => {
  try {
    const category = new CategoryRepository(req);
    let params = req.params;
    if (params.product && params.product !== "product") {
      throw new BadRequestError(`Resource ${params.product} Not Valid`);
    }

    let data = await category.findAll({
      relations: params.product && [{
        model: params.product,
        attributes: ["id", "code", "name"],
      }]
    });
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.store = async (req, res, next) => {
  try {
    const category = new CategoryRepository(req);
    let data = await category.create({ data: req.body });
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const category = new CategoryRepository(req);
    let params = req.params;
    if (params.product && params.product !== "product") {
      throw new BadRequestError(`Resource ${params.product} Not Valid`);
    }
  
    let data = await category.findOne({
      where: { id: params.id },
      relations: params.product && [{
        model: params.product,
        attributes: ["id", "code", "name"],
      }]
    });
    if (!data) throw new NotFoundError("Category Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    const category = new CategoryRepository(req);
    let data = await category.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Category Not Found")

    Object.assign(data, req.body)
    await category.update({ data, where: { id: data.id } })
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const category = new CategoryRepository(req);
    let data = await category.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("Category Not Found");

    await category.softDelete({ where: { id: data.id } });
    res.success(data);
  } catch (error) {
    next(error);
  }
}