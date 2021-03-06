const rbacService = appRequire("services", "rbac");

exports.assign = async (req, res, next) => {
  try {
    let { type } = req.params;
    let data;
    if (type === 'role') {
      let { user_id, roles } = req.body;
      data = await rbacService.assignRole({ user_id, roles, req });
    } else if (type === 'permission') {
      let { role_id, permissions } = req.body;
      data = await rbacService.assignPermission({ role_id, permissions, req });
    }

    res.success(data);
  } catch (error) {
    next(error);
  }
};

exports.unassign = async (req, res, next) => {
  try {
    let { type } = req.params;
    let data;
    if (type === 'role') {
      let { user_id, roles } = req.body;
      data = await rbacService.unassignRole({ user_id, roles, req });
    } else if (type === 'permission') {
      let { role_id, permissions } = req.body;
      data = await rbacService.unassignPermission({ role_id, permissions, req });
    }


    res.success(data);
  } catch (error) {
    next(error);
  }
};
