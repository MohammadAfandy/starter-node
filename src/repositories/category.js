const BaseRepository = appRequire("repositories");
class CategoryRepository extends BaseRepository {
  constructor(request) {
    super(request, "category");
  }
}

module.exports = CategoryRepository;