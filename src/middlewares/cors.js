const cors = require("cors");
// const { allowedOrigin } = appRequire("config");

// const corsMiddleware = cors({
//   origin: (origin, callback) => {
//     const isAllowed = allowedOrigin.some(v => new RegExp(v, "i").test(origin));
//     if (isAllowed) {
//       callback(null, true);
//     } else {
//       callback(new Error("Your IP Doesn't"));
//     }
//   }
// });

const corsMiddleware = cors();

module.exports = corsMiddleware;
