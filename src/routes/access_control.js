const express = require("express");
const router = express.Router();
const cacheCtrl = appRequire("controllers", "cache");
const allowedOriginCtrl = appRequire("controllers", "allowed_origin");
const rbacCtrl = appRequire("controllers", "rbac");
// const accessValidator = appRequire("validators", "access");

// cache
router.post("/cache/get", cacheCtrl.get);
router.post("/cache/delete", cacheCtrl.delete);
router.post("/cache/refresh", cacheCtrl.refresh);
router.post("/cache/list", cacheCtrl.list);

// allowed origin
router.get("/allowed_origin", allowedOriginCtrl.index);
router.post("/allowed_origin", allowedOriginCtrl.store);
router.get("/allowed_origin/:id(\\d+)", allowedOriginCtrl.findOne);
router.put("/allowed_origin/:id(\\d+)", allowedOriginCtrl.update);
router.delete("/allowed_origin/:id(\\d+)", allowedOriginCtrl.destroy);

// role permission assignment
router.post("/rbac/assign/:type", rbacCtrl.assign);
router.post("/rbac/unassign/:type", rbacCtrl.unassign);

module.exports = router;