const BaseRepository = appRequire("repositories");
const { role: model } = appRequire("models");

class RoleRepository extends BaseRepository {
  constructor(request) {
    super(model, request);
  }
}

module.exports = RoleRepository;