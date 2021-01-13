const cors = require("cors");
const { allowedOrigin } = appRequire("config");

const corsMiddleware = cors({
  origin: (origin, callback) => {
    const isAllowed = allowedOrigin.some(v => new RegExp(v, "i").test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  }
});

module.exports = corsMiddleware;
