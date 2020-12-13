const express = require("express");
const { appRequire } = require("../utils/functions");
const router = express.Router();
const authCtrl = appRequire("controllers", "auth");
const authMiddleware = appRequire("middlewares", "auth");
const authValidator = appRequire("validators", "auth");

router.post("/register", authValidator.register, authCtrl.register);
router.post("/login", authValidator.login, authCtrl.login);
router.post("/refresh", authMiddleware, authValidator.refresh, authCtrl.refresh);
router.post("/logout", authMiddleware, authCtrl.logout);

module.exports = router;