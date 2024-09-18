const express = require("express");
const router = express.Router();
const controller = require("../controllers/site.c");

router.get("/", controller.getIndex);

module.exports = router;
