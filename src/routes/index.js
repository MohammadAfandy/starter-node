const express = require("express");
const router = express.Router();
const { loginAuth, hasPermission } = appRequire("middlewares", "auth");

// use router
router.use("/auth", appRequire("routes", "auth"));
router.use("/category", loginAuth, appRequire("routes", "category"));
router.use("/product", loginAuth, appRequire("routes", "product"));
router.use("/user", loginAuth, appRequire("routes", "user"));
router.use(
  "/access_control",
  loginAuth,
  hasPermission('access_control-manage'),
  appRequire("routes", "access_control")
);

// 3rd party url
router.use(
  "/misc",
  loginAuth,
  hasPermission('access_control-manage'),
  appRequire("routes", "misc")
);

// use controller
router.get("/", appRequire("controllers", "version").index);

module.exports = router;
