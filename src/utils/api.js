const axios = require("axios");

class Api {
  constructor(baseUrl, config = {}) {
    const instance = axios.create({
      ...config,
      baseURL: baseUrl,
    });

    return instance;
  }
}

module.exports = Api;
