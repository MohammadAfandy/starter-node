const authService = appRequire("services", "auth");
const tokenRepo = appRequire("repositories", "token");
const { baseUrl } = appRequire("config");

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

    const process = await authService.register({ req, ...userData });

    return res.success(process);
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    let { credential, password, device } = req.body;
    
    const process = await authService.login({ req, credential, password, device });
    const { userData, tokenData } = process;
    res.success({
      username: userData.username,
      email: userData.email,
      phone_number: userData.phone_number,
      fullname: userData.fullname,
      roles: userData.roles.map(v => v.role_name),
      image_path: baseUrl + '/uploads/' + userData.image_path,
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
    tokenData = await tokenRepo(req).refreshToken(refresh_token);
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
    await tokenRepo(req).deleteToken(req.token.access_token);
    res.success({}, "Logout Success");
  } catch (error) {
    next(error)
  }
}

exports.profile = async (req, res, next) => {
  try {
    res.success({
      token: req.token,
      user: req.user,
    });
  } catch (error) {
    next(error)
  }
}
