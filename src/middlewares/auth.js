const tokenRepo = appRequire("repositories", "token");
const myCache = appRequire("utils", "cache");

const loginAuth = async (req, res, next) => {
  try {
    let { "access-token": accessToken } = req.headers;
    if (!accessToken) throw new UnauthorizedError("Access Token Required");
  
    let now = new Date();
    let token = await tokenRepo(req).findOne({
      where: { access_token: accessToken },
      include: [{
        model: "user",
        attributes: ["id", "username", "email", "phone_number", "fullname"],
        required: true,
      }],
    });

    if (!token) throw new UnauthorizedError("Invalid Access Token");
    if (token.access_token_expired_at < now) throw new UnauthorizedError("Access Token Already Expired");

    // assign role and permission from cache
    const rolePermission = myCache.get('role_permission');
    let roles = [];
    let permissions = [];
    let user_id = token.user.id.toString();
    if (rolePermission && rolePermission[user_id]) {
      roles = rolePermission[user_id].roles;
      permissions = rolePermission[user_id].permissions;
    }

    req.token = {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      access_token_expired_at: token.access_token_expired_at,
      refresh_token_expired_at: token.refresh_token_expired_at,
      device: token.device,
    };
    req.user = {
      id: token.user_id,
      username: token.user.username,
      email: token.user.email,
      phone_number: token.user.phone_number,
      fullname: token.user.fullname,
      roles,
      permissions,
    };
    next();
  } catch (error) {
    next(error);
  }
}

const hasPermission = (requiredPerms) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const { permissions } = req.user;
      if (!isArray(requiredPerms)) {
        requiredPerms = [requiredPerms];
      }

      // if user has permissions that included in 1 of required route permissions
      const isAllowed = requiredPerms.some((v) => {
        return permissions.includes(v);
      });

      if (!isAllowed) {
        throw new ForbiddenError("You don't have permission to access this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.loginAuth = loginAuth;
exports.hasPermission = hasPermission;
