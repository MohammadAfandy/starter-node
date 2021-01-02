const tokenRepository = appRequire("repositories", "token");

const authMiddleware = async (req, res, next) => {
  try {
    let { "access-token": accessToken } = req.headers;
    if (!accessToken) throw new UnauthorizedError("Access Token Required");
  
    let now = new Date();
    const tokenRepo = new tokenRepository(req);
    let token = await tokenRepo.findOne({
      where: { access_token: accessToken },
      relations: [{
        model: "user",
        attributes: ["username", "email", "phone_number", "fullname"],
        required: true,
      }]
    });
    
    if (!token) throw new UnauthorizedError("Invalid Access Token");
    if (token.access_token_expired_at < now) throw new UnauthorizedError("Access Token Already Expired");
  
    req.token = {
      accessToken: token.access_token,
      device: token.device,
    };
    req.user = {
      id: token.user_id,
      username: token.user.username,
      email: token.user.email,
      phone_number: token.user.phone_number,
      fullname: token.user.fullname,
    };
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware