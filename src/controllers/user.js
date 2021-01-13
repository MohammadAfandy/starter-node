const UserRepository = appRequire("repositories", "user");
const tableLib = appRequire("libs", "table");

exports.index = async (req, res, next) => {
  try {
    // the orm way
    // const user = new UserRepository(req);
    // let query = req.query;
    // let data = await user.dataTable({
    //   include: [{
    //     model: 'role',
    //     attributes: ['role_name'],
    //     through: { attributes: [] },
    //   }],
    //   query: query.q,
    //   page: query.page,
    //   limit: query.limit,
    //   sort: query.sort,
    // });

    // the raw way
    const columns = [
      ['u.id', 'id'],
      ['u.fullname', 'fullname'],
      ['u.username', 'username'],
      ['GROUP_CONCAT(r.role_name)', 'role_name'],
      ['u.email', 'email'],
      ['u.phone_number', 'phone_number'],
      ['u.created_at', 'created_at'],
    ];
    const query =  `
      SELECT {{columns}}
      FROM users u
      LEFT JOIN user_role ur ON u.id = ur.user_id
      LEFT JOIN role r ON ur.role_id = r.id
      WHERE u.deleted_at IS NULL
      GROUP BY u.id
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
    const user = new UserRepository(req);
    let data = await user.create({ data: req.body });
    res.success(data);
  } catch (error) {
    next(error)
  }
}

exports.findOne = async (req, res, next) => {
  try {
    const user = new UserRepository(req);
    let data = await user.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("User Not Found")
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.update = async (req, res, next) => {
  try {
    const user = new UserRepository(req);
    let data = await user.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("user Not Found")

    Object.assign(data, req.body)
    await user.update({ data, where: { id: data.id } })
    res.success(data);
  } catch (error) {
    next(error);
  }
}

exports.destroy = async (req, res, next) => {
  try {
    const user = new UserRepository(req);
    let data = await user.findByPk({ id: req.params.id });
    if (!data) throw new NotFoundError("User Not Found");

    await user.softDelete({ where: { id: data.id } });
    res.success(data);
  } catch (error) {
    next(error);
  }
}