const express = require("express");
const router = express.Router();
const productCtrl = appRequire("controllers", "product");
const productValidator = appRequire("validators", "product");
const { hasPermission } = appRequire("middlewares", "auth");

router.get("/", hasPermission('product-read'), productCtrl.index);
router.post("/", hasPermission('product-add'), productValidator.create, productCtrl.store);
router.get("/:id(\\d+)", hasPermission('product-read'), productCtrl.findOne);
router.put("/:id(\\d+)", hasPermission('product-edit'), productValidator.create, productCtrl.update);
router.delete("/:id(\\d+)", hasPermission('product-delete'), productCtrl.destroy);

module.exports = router;
