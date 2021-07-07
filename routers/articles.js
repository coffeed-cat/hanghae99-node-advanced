const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");
const Article = require("../models/article");

router.use("/comments", commentsRouter);

router.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.send(articles);
});

router.get("/:articleId", async (req, res) => {
  res.render("detail");
});

router.get("/:articleId/data", async (req, res) => {
  const { articleId } = req.params;

  const article = await Article.findById(articleId);

  if (!article) {
    res.status(400).send({ message: "존재하지 않는 게시물입니다." });
    return;
  }
  res.send(article);
});

module.exports = router;
