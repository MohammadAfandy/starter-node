const ProductRepository = appRequire("repositories", "product");
const tableLib = appRequire("libs", "table");

exports.index = async (req, res, next) => {
  try {
    const columns = [
      ['p.id', 'id'],
      ['p.code', 'code'],
      ['p.name', 'name'],
      ['c.name', 'category'],
      ['c.id', 'category_id'],
      ['p.description', 'description'],
      ['p.created_at', 'created_at'],
    ];
    const query =  `
      SELECT {{columns}}
      FROM product p
      LEFT JOIN category c ON p.category_id = c.id
      WHERE p.deleted_at IS NULL
    `;
    const { q: search, page, limit, sort } = req.query; 
    const data = await tableLib.generatePagination({
      req, query, search, page, limit, sort, columns
    })
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

    data = Object.assign(data.dataValues, req.body);
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