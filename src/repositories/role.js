const BaseRepository = appRequire("repositories");

class RoleRepository extends BaseRepository {
  constructor(request) {
    super(request, "role");
  }
}

module.exports = RoleRepository;