const BaseRepository = appRequire("repositories");

class UserRoleRepository extends BaseRepository {
  constructor(request) {
    super(request, "user_role");
  }
}

module.exports = (req) => {
  return (new UserRoleRepository(req));
};
