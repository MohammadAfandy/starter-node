const express = require("express");
const router = express.Router();
const authCtrl = appRequire("controllers", "auth");
const { loginAuth } = appRequire("middlewares", "auth");
const authValidator = appRequire("validators", "auth");

router.post("/register", authValidator.register, authCtrl.register);
router.post("/login", authValidator.login, authCtrl.login);
router.post("/refresh", authValidator.refresh, authCtrl.refresh);
router.post("/logout", loginAuth, authCtrl.logout);
router.get("/profile", loginAuth, authCtrl.profile);

module.exports = router;
