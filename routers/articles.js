const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");

router.use("/comments", commentsRouter);

router.get("/", (req, res) => {
  res.json({ articles });
});

module.exports = router;
