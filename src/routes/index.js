const express = require("express");
const router = express.Router();
const authMiddleware = appRequire("middlewares", "auth");

// use router
router.use("/auth", appRequire("routes", "auth"));
router.use("/category", authMiddleware, appRequire("routes", "category"));
router.use("/product", authMiddleware, appRequire("routes", "product"));

// use controller
router.get("/", appRequire("controllers", "version").index);

module.exports = router;