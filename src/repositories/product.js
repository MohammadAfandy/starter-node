const BaseRepository = appRequire("repositories");
class ProductRepository extends BaseRepository {
  constructor(request) {
    super(request, "product");
  }
}

module.exports = ProductRepository;