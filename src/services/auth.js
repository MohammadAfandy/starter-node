const userRepo = appRequire("repositories", "user");
const roleRepo = appRequire("repositories", "role");
const userRoleRepo = appRequire("repositories", "user_role");
const tokenRepo = appRequire("repositories", "token");
const helper = appRequire("utils", "helpers");
const { sequelize } = appRequire("models");

const register = async ({ req, ...userData }) => {
  // validation
  await userRepo(req).validate(req.body);
  
  let promises = [];
  for (let i in userData.role) {
    promises.push(roleRepo(req).findOne({ where: { role_name: userData.role[i] } }));
  }
  let roles = await Promise.all(promises);
  let errorRoles = [];
  for (let i in roles) {
    if (!roles[i]) errorRoles.push(userData.role[i]);
  }
  
  if (errorRoles.length) {
    throw new ValidationError("Validation Error", errorRoles.map(v => {
      return { param: "role" , msg: `Invalid Role ${v}` };
    }));
  }

  // upload files
  if (req && req.files && req.files.length) {
    let uploadFile = await moveUploadedFile(req.files, "image", "user/" + userData.username, "image");
    await helper.file.compressImage(uploadFile);
    userData.image_path = uploadFile.dir + "/" + uploadFile.fullname;
  }

  let user;
  // start transaction
  await sequelize.transaction(async (t) => {
    userData.password = await helper.encrypt.generatePassword(userData.password);
    user = await userRepo(req).create({ data: userData, transaction: t });
    for (let i in roles) {
      await userRoleRepo(req).create({
        data: { user_id: user.id, role_id: roles[i].id },
        transaction: t,
      });
    }
  });
  return user;
};

const login = async ({ req, credential, password, device }) => {
  // ==================== Start User Validation ====================
  let userData = await userRepo(req).findCredential(credential);
  if (!userData) throw new NotFoundError("Username / Email not found");
  if (userData.status === "INACTIVE") throw new UnauthorizedError("User has not been activated yet");
  if (userData.status === "BANNED") throw new UnauthorizedError("User has been banned");

  fancyLog(helper);
  let checkPass = await helper.encrypt.checkPasswordValid(password, userData.password);
  if (!checkPass) throw new UnauthorizedError("Wrong Password");
  // ==================== End User Validation ====================

  // ==================== Start Token Generation Process ====================
  let checkToken = await tokenRepo(req).findOne({
    where: {
      user_id: userData.id,
      device: device || null,
    }
  });
  let tokenData = {};
  if (checkToken) { // token already exist
    tokenData = await tokenRepo(req).updateToken(checkToken.access_token, checkToken.refresh_token); // update access and refresh token
  } else { // token not exist, create new token
    tokenData = await tokenRepo(req).createToken(userData.id, device);
  }
  // ==================== End Token Generation Process ====================

  return {
    userData,
    tokenData
  };
};

exports.register = register;
exports.login = login;
