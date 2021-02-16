const moment = require("moment");
const BaseRepository = appRequire("repositories");
const { accessTokenLifeTime, refreshTokenLifeTime } = appRequire("config");
const stringLib = appRequire("libs", "string");

class TokenRepository extends BaseRepository {
  constructor(request) {
    super(request, "token");
  }

  async checkExist(accessToken, refreshToken) {
    let promises = [this.count({ where: { access_token: accessToken } })];
    if (refreshToken) {
      promises.push(this.count({ where: { refresh_token: refreshToken } }));
    }
    let checkToken = await Promise.all(promises);

    return checkToken.some(v => v > 0);
  }

  async generateToken(withRefresh = true) {
    let token = {};

    do {
      token.accessToken = stringLib.randomString();
      if (withRefresh) {
        token.refreshToken = stringLib.randomString();
      }
    } while (await this.checkExist(token.accessToken, token.refreshToken));

    return token;
  }

  async createToken(userId, device) {
    let { accessToken, refreshToken } = await this.generateToken();
    let now = new Date();
    let tokenData = {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: userId,
      device: device || null,
      access_token_expired_at: moment(now).add(accessTokenLifeTime, "seconds").toDate(),
      refresh_token_expired_at: moment(now).add(refreshTokenLifeTime, "seconds").toDate(),
    };

    await this.create({ data: tokenData });

    return tokenData;
  }

  async updateToken(accessToken, refreshToken) {
    let token = await this.findOne({
      where: { access_token: accessToken, refresh_token: refreshToken },
    });
    if (!token) throw new NotFoundError("User with this device Not Found.");
    let {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await this.generateToken();

    let now = new Date();
    let tokenData = {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      access_token_expired_at: moment(now).add(accessTokenLifeTime, "seconds").toDate(),
      refresh_token_expired_at: moment(now).add(refreshTokenLifeTime, "seconds").toDate(),
    };

    await this.update({
      data: tokenData,
      where: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    return token;
  }

  async refreshToken(oldAccessToken, refreshToken) {
    let now = new Date();
    let token = await this.findOne({
      where: {
        access_token: oldAccessToken,
        refresh_token: refreshToken,
      },
    });
    if (!token) throw new NotFoundError("Refresh Token Not Found");
    if (token.refresh_token_expired_at < now) throw new BadRequestError("Refresh Token Already Expired. Please Login Again");

    let { accessToken: newAccessToken } = await this.generateToken(false);

    let tokenData = {
      access_token: newAccessToken,
      access_token_expired_at: moment(now).add(accessTokenLifeTime, "seconds").toDate(),
    };

    await this.update({
      data: tokenData,
      where: {
        access_token: oldAccessToken,
        refresh_token: refreshToken,
      },
    });

    return token;
  }

  async deleteToken(accessToken) {
    let token = await this.findOne({
      where: { access_token: accessToken },
    });
    if (!token) throw new NotFoundError("Access Token Not Found.");
    await token.destroy();

    return token;
  }
}

module.exports = TokenRepository;