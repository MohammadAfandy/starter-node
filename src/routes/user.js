const express = require("express");
const router = express.Router();
const userCtrl = appRequire("controllers", "user");
const userValidator = appRequire("validators", "user");

router.get("/", userCtrl.index);
router.post("/", userValidator.create, userCtrl.store);
router.get("/:id(\\d+)", userCtrl.findOne);
router.put("/:id(\\d+)", userValidator.create, userCtrl.update);
router.delete("/:id(\\d+)", userCtrl.destroy);

module.exports = router;