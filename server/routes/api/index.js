let router = require("express").Router();

router.use("/upload", require("./upload"));
router.use("/quiz", require("./quiz"));

module.exports = router;
