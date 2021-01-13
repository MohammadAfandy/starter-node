const BaseRepository = appRequire("repositories");

exports.generatePagination = async ({
  req,
  query: baseQuery,
  search,
  page = 0,
  limit = 20,
  sort,
  columns,
}) => {
  const repo = new BaseRepository(req);
  let addQuery = "";
  let replacements = [];
  let condition = "";
  let select = columns.map(v => {
    if (isArray(v)) return `${v[0]} AS ${v[1]}`;
    return v;
  }).join(", ");

  baseQuery = baseQuery.replace("{{columns}}", select);

  if (search) {
    condition = columns.map(v => {
      let col = isArray(v) ? v[1] : v;
      return `${col} LIKE ?`;
    }).join(" OR ");
    addQuery += `WHERE (${condition}) `;
    replacements = Array(columns.length).fill("%" + search + "%");
  }

  if (sort) {
    sort = sort.split(":");
    addQuery += `ORDER BY ${sort[0]} ${sort[1]} `;
  }

  let queryCount = `SELECT COUNT(*) AS total FROM (${baseQuery}) src ${addQuery}`;
  addQuery += `LIMIT ${page * limit}, ${limit}`;
  let queryData = `SELECT * FROM (${baseQuery}) src ${addQuery}`;

  let [data, { total }] = await Promise.all([
    repo.selectRaw({ query: queryData, replacements }),
    repo.selectRaw({ query: queryCount, replacements, plain: true }),
  ]);

  return {
    data,
    total,
    totalPage: Math.ceil(total / limit),
  }
};
