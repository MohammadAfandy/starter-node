const CategoryRepository = appRequire("repositories", "category");
const tableLib = appRequire("libs", "table");

exports.index = async (req, res, next) => {
  try {
    const columns = [
      'id',
      'code',
      'name',
      'description',
      'created_at',
    ];
    const query =  `
      SELECT {{columns}}
      FROM category u
      WHERE deleted_at IS NULL
    `;
    const { q: search, page, limit, sort } = req.query; 
    const data = await tableLib.generatePagination({
      req, query, search, page, limit, sort, columns
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
      include: params.product && [{
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

    data = Object.assign(data.dataValues, req.body);
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