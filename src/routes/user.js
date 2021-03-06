const express = require("express");
const router = express.Router();
const userCtrl = appRequire("controllers", "user");
const userValidator = appRequire("validators", "user");
const { hasPermission } = appRequire("middlewares", "auth");

router.get("/", hasPermission('user-read'), userCtrl.index);
router.post("/", hasPermission('user-add'), userValidator.create, userCtrl.store);
router.get("/:id(\\d+)", hasPermission('user-read'), userCtrl.findOne);
router.put("/:id(\\d+)", hasPermission('user-edit'), userValidator.create, userCtrl.update);
router.delete("/:id(\\d+)", hasPermission('user-delete'), userCtrl.destroy);

module.exports = router;
