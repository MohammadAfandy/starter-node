const BaseRepository = appRequire("repositories");
const { user_role: model } = appRequire("models");

class UserRoleRepository extends BaseRepository {
  constructor(request) {
    super(model, request);
  }
}

module.exports = UserRoleRepository;