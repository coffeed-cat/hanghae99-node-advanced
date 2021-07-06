const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");
const Article = require("../models/article");

router.use("/comments", commentsRouter);

router.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.send(articles);
});

module.exports = router;
