const express = require("express");
const router = express.Router();
const miscCtrl = appRequire("controllers", "misc");

// calendar
router.post("/calendar/generate", miscCtrl.calendarGenerate);

module.exports = router;
