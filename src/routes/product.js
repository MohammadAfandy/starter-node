const express = require("express");
const router = express.Router();
const productCtrl = appRequire("controllers", "product");
const productValidator = appRequire("validators", "product");

router.get("/", productCtrl.index);
router.post("/", productValidator.create, productCtrl.store);
router.get("/:id(\\d+)", productCtrl.findOne);
router.put("/:id(\\d+)", productValidator.create, productCtrl.update);
router.delete("/:id(\\d+)", productCtrl.destroy);

module.exports = router;