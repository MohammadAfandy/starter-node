const BaseRepository = appRequire("repositories");

class AllowedOriginRepository extends BaseRepository {
  constructor(request) {
    super(request, "allowed_origin");
  }

  async getAll({
    search,
    page,
    limit,
    sort,
  }) {
    const columns = [
      'id',
      'origin',
      'created_at',
    ];
    const query =  `
      SELECT {{columns}}
      FROM allowed_origin
      WHERE deleted_at IS NULL
    `;

    const data = await this.generateQuery({ columns, query, search, page, limit, sort });
    
    return data;
  }

}

module.exports = (req) => {
  return (new AllowedOriginRepository(req));
}
