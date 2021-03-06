const BaseRepository = appRequire("repositories");

class PermissionRepository extends BaseRepository {
  constructor(request) {
    super(request, "permission");
  }
}

module.exports = (req) => {
  return (new PermissionRepository(req));
};
