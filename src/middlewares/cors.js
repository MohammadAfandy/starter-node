const cors = require("cors");
const myCache = appRequire("utils", "cache");

const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigin = myCache.get('allowed_origin');
    let isAllowed = false;
    if (!origin) { // from same origin
      isAllowed = true;
    } else {
      isAllowed = allowedOrigin ? (allowedOrigin.includes(origin)) : false;
    }
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
});

module.exports = corsMiddleware;
