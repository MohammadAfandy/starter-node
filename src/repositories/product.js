const BaseRepository = appRequire("repositories");
const { product: model } = appRequire("models");

class ProductRepository extends BaseRepository {
  constructor(request) {
    super(model, request);
  }
}

module.exports = ProductRepository;