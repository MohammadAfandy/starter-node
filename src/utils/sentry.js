const Sentry = require("@sentry/node");
const { dsn } = appRequire("config").sentry;

Sentry.init({
  dsn: dsn
});

module.exports = Sentry;
