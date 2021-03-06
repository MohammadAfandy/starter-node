const express = require("express");
const router = express.Router();
const categoryCtrl = appRequire("controllers", "category");
const categoryValidator = appRequire("validators", "category");
const { hasPermission } = appRequire("middlewares", "auth");

/**
 * /category/
 * /category/product/
 */
router.get("/:product(\\D+)?", hasPermission('category-read'), categoryCtrl.index);

// /category/
router.post("/", hasPermission('category-add'), categoryValidator.create, categoryCtrl.store);

/**
 * /category/<id>
 * /category/<id>/product
 */
router.get("/:id(\\d+)/:relation?", hasPermission('category-read'), categoryCtrl.findOne);

router.put("/:id(\\d+)", hasPermission('category-edit'), categoryValidator.create, categoryCtrl.update);
router.delete("/:id(\\d+)", hasPermission('category-delete'), categoryCtrl.destroy);

module.exports = router;
