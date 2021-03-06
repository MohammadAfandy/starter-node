const categoryRepo = appRequire("repositories", "category");

exports.index = async (req, res, next) => {
  try {
    const { q: search, page, limit, sort } = req.query;
    const data = await categoryRepo(req).getAll({ search, page, limit, sort });
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.store = async (req, res, next) => {
  try {
    let data = await categoryRepo(req).create({ data: req.body });
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    let { id, relation } = req.params;
    if (relation && relation.toLowerCase() !== 'product') {
      throw new BadRequestError("Invalid Param " + relation)
    };

    let data;
    if (relation) {
      data = await categoryRepo(req).getCategoryWithProduct({ id });
    } else {
      data = await categoryRepo(req).findOne({ where: {id} });
    }
    if (!data) throw new NotFoundError("Category Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    const { code, description, name } = req.body;
    const process = await categoryRepo(req).firstAndUpdate({
      where: { id: req.params.id },
      data: { code, description, name }
    });
    res.success(process);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const process = await categoryRepo(req).firstAndDestroy({ where: { id: req.params.id } });
    res.success(process);
  } catch (error) {
    next(error);
  }
}
