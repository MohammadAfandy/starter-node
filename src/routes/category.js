const express = require("express");
const router = express.Router();
const categoryCtrl = appRequire("controllers", "category");
const categoryValidator = appRequire("validators", "category");

/**
 * /category/
 * /category/product/
 */
router.get("/:product(\\D+)?", categoryCtrl.index);

// /category/
router.post("/", categoryValidator.create, categoryCtrl.store);

/**
 * /category/<id>
 * /category/<id>/product
 */
router.get("/:id(\\d+)/:product?", categoryCtrl.findOne);

router.put("/:id(\\d+)", categoryValidator.create, categoryCtrl.update);
router.delete("/:id(\\d+)", categoryCtrl.destroy);

module.exports = router;