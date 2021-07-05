const express = require("express");
const router = express.Router();
const accountRouter = require("./account");

router.use("/account", accountRouter);

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
