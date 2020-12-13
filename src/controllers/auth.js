const UserRepository = appRequire("repositories", "user");
const RoleRepository = appRequire("repositories", "role");
const UserRoleRepository = appRequire("repositories", "user_role");
const TokenRepository = appRequire("repositories", "token");
const stringLib = appRequire("libs", "string");
const { sequelize } = appRequire("models");

exports.register = async (req, res, next) => {
  try {
    let userData = {
      username: req.body.username,
      email: req.body.email,
      phone_number: req.body.phone_number,
      password: req.body.password,
      fullname: req.body.fullname,
      role: req.body.role || ["Public"],
    }
    const userRepo = new UserRepository(req);

    let checkDuplicate = await userRepo.checkDuplicate({
      username: userData.username,
      email: userData.email,
      phone_number: userData.phone_number,
    });

    if (checkDuplicate.length) {
      throw new ValidationError("Validation Error", checkDuplicate.map(v => {
        return { param: v , msg: `${v} already taken`, value: userData[v] };
      }));
    }

    const roleRepo = new RoleRepository(req);
    let promisesRole = [];
    for (let i in userData.role) {
      promisesRole.push(roleRepo.findOne({ where: { role_name: userData.role[i] } }));
    }
    let roles = await Promise.all(promisesRole);
    let errorRoles = [];
    for (let i in roles) {
      if (!roles[i]) errorRoles.push(userData.role[i]);
    }
    
    if (errorRoles.length) {
      throw new ValidationError("Validation Error", errorRoles.map(v => {
        return { param: "role" , msg: `Invalid Role ${v}`, value: v };
      }));
    }

    const userRoleRepo = new UserRoleRepository(req);
    await sequelize.transaction(async (t) => {
      userData.password = await stringLib.generatePassword(userData.password);
      let user = await userRepo.create({ data: userData, addOptions: { transaction: t } });
      for (let i in roles) {
        await userRoleRepo.create({ data: { user_id: user.id, role_id: roles[i].id }, addOptions: { transaction: t } });
      }
      res.success(user, "Registration Success");
    });
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    let { credential, password, device } = req.body;
    const user = new UserRepository(req);
    
    // ==================== Start User Validation ====================
    let userData = await user.findCredential(credential);
    if (!userData) throw new NotFoundError("Username / Email Not Found");
    if (userData.status === "INACTIVE") throw new UnauthorizedError("User Hast Not Been Activated Yet");
    if (userData.status === "BANNED") throw new UnauthorizedError("User Has Been Banned");

    let checkPass = await stringLib.checkPasswordValid(password, userData.password);
    if (!checkPass) throw new UnauthorizedError("Wrong Password");
    // ==================== End User Validation ====================

    // ==================== Start Token Generation Process ====================
    const tokenRepo = new TokenRepository(req);
    let checkToken = await tokenRepo.findOne({
      where: {
        user_id: userData.id,
        device: device || null,
      }
    });
    let now = new Date();
    let tokenData = {};
    if (checkToken) { // token already exist
      if (checkToken.access_token_expired_at < now) { // access token is expired
        if (checkToken.refresh_token_expired_at < now) { // refresh token is expired
          tokenData = await tokenRepo.updateToken(userData.id, device); // update access and refresh token
        } else { // access token expired but refresh token still active
          tokenData = await tokenRepo.refreshToken(checkToken.access_token, checkToken.refresh_token); // only update access token
        }
      } else { // access token still active
        tokenData.access_token = checkToken.access_token;
        tokenData.refresh_token = checkToken.refresh_token;
        tokenData.device = checkToken.device;
        tokenData.access_token_expired_at = checkToken.access_token_expired_at;
        tokenData.refresh_token_expired_at = checkToken.refresh_token_expired_at;
      }
    } else { // token not exist, create new token
      tokenData = await tokenRepo.createToken(userData.id, device);
    }
    // ==================== Start Token Generation Process ====================
    
    res.success({
      username: userData.username,
      email: userData.email,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      device: tokenData.device,
      access_token_expired_at: tokenData.access_token_expired_at,
      refresh_token_expired_at: tokenData.refresh_token_expired_at,
    });
  } catch (error) {
    next(error);
  }
}

exports.refresh = async (req, res, next) => {
  try {
    let { refresh_token } = req.body;
    const tokenRepo = new TokenRepository(req);
    tokenData = await tokenRepo.refreshToken(req.token.accessToken, refresh_token);
    res.success({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      device: tokenData.device,
      access_token_expired_at: tokenData.access_token_expired_at,
      refresh_token_expired_at: tokenData.refresh_token_expired_at,
    });
  } catch (error) {
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    const tokenRepo = new TokenRepository(req);
    await tokenRepo.deleteToken(req.user.id, req.token.device);
    res.success({}, "Logout Success");
  } catch (error) {
    next(error)
  }
}