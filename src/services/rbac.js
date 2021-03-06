const userRepo = appRequire("repositories", "user");
const roleRepo = appRequire("repositories", "role");
const userRoleRepo = appRequire("repositories", "user_role");
const permissionRepo = appRequire("repositories", "permission");
const rolePermissionRepo = appRequire("repositories", "role_permission");
const myCache = appRequire("utils", "cache");

const getRoles = async (user_id) => {
  const res = await userRepo().findOne({
    attributes: ['id', 'username'],
    where: { id: user_id },
    include: [{
      model: 'role',
      attributes: ['id', 'role_name'],
      through: { attributes: [] },
    }]
  });

  return res;
};

const getPermissions = async (role_id) => {
  const res = await roleRepo().findOne({
    attributes: ['id', 'role_name'],
    where: { id: role_id },
    include: [{
      model: 'permission',
      attributes: ['permission'],
      through: { attributes: [] },
    }]
  });

  return res;
};

const assignRole = async ({ user_id, roles, req }) => {
  // check user_id
  const checkUser = await userRepo(req).findOne({
    where: { id: user_id }
  });
  if (!checkUser) {
    throw new ValidationError("Validation Error", [{
      param: "user_id",
      msg: "user_id not valid",
    }]) 
  }

  // check role_id
  const allRepo = await roleRepo(req).findAll();
  const allRepoIds = allRepo.map((v) => v.id);
  if (roles.some((v) => false === allRepoIds.includes(v))) {
    throw new ValidationError("Validation Error", [{
      param: "roles",
      msg: "Some of role id not valid",
    }]) 
  }

  await userRoleRepo(req).bulkCreate({
    data: roles.map((v) => ({ user_id: user_id, role_id: v })),
    updateOnDuplicate: ['user_id', 'role_id'],
  });

  // refresh cache
  myCache.setRolePermission();

  return await getRoles(user_id);
};

const assignPermission = async ({ role_id, permissions, req }) => {
  // check user_id
  const checkRole = await roleRepo(req).findOne({
    where: { id: role_id }
  });

  if (!checkRole) {
    throw new ValidationError("Validation Error", [{
      param: "role_id",
      msg: "role_id not valid",
    }]) 
  }

  // check permission
  const allPermission = await permissionRepo(req).findAll();
  const allPermissionIds = allPermission.map((v) => v.permission);
  if (permissions.some((v) => false === allPermissionIds.includes(v))) {
    throw new ValidationError("Validation Error", [{
      param: "permissions",
      msg: "Some of permissions not valid",
    }]) 
  }
  
  await rolePermissionRepo(req).bulkCreate({
    data: permissions.map((v) => ({ role_id: role_id, permission: v })),
    updateOnDuplicate: ['role_id', 'permission'],
  });

  // refresh cache
  myCache.setRolePermission();

  return await getPermissions(role_id);
};

const unassignRole = async ({ user_id, roles, req }) => {
  await userRoleRepo(req).destroy({
    where: {
      user_id: user_id,
      role_id: roles,
    },
  });

  // refresh cache
  myCache.setRolePermission();

  return await getRoles(user_id);
};

const unassignPermission = async ({ role_id, permissions, req }) => {
  await rolePermissionRepo(req).destroy({
    where: {
      role_id: role_id,
      permission: permissions,
    },
  });

  // refresh cache
  myCache.setRolePermission();

  return await getPermissions(role_id);
};

exports.assignRole = assignRole;
exports.assignPermission = assignPermission;
exports.unassignRole = unassignRole;
exports.unassignPermission = unassignPermission;
