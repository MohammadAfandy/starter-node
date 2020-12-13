const BaseRepository = appRequire("repositories");
const { category: model } = appRequire("models");

class CategoryRepository extends BaseRepository {
  constructor(request) {
    super(model, request);
  }
}

module.exports = CategoryRepository;