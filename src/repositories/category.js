const BaseRepository = appRequire("repositories");
class CategoryRepository extends BaseRepository {
  constructor(request) {
    super(request, "category");
  }

  async getAll({
    search,
    page,
    limit,
    sort,
  }) {
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

    const data = await this.generateQuery({ columns, query, search, page, limit, sort });
    
    return data;
  }

  async getCategoryWithProduct(where) {
    const data = await this.findOne({
      where,
      include: [{
        model: "product",
        attributes: ["id", "code", "name"],
      }]
    });

    return data;
  }
}

module.exports = (req) => {
  return (new CategoryRepository(req));
};
