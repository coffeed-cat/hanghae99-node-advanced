const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");

router.use("/comments", commentsRouter);

router.get("/", (req, res) => {
  res.send("hi");
});

module.exports = router;
