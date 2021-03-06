const BaseRepository = appRequire("repositories");

class RolePermissionRepository extends BaseRepository {
  constructor(request) {
    super(request, "role_permission");
  }
}

module.exports = (req) => {
  return (new RolePermissionRepository(req));
};
