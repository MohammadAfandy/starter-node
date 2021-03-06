const BaseRepository = appRequire("repositories");
class ProductRepository extends BaseRepository {
  constructor(request) {
    super(request, "product");
  }

  async getAll({
    search,
    page,
    limit,
    sort,
  }) {
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

    const data = await this.generateQuery({ columns, query, search, page, limit, sort });
    
    return data;
  }
}

module.exports = (req) => {
  return (new ProductRepository(req));
};
