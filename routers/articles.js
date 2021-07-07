const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");
const Article = require("../models/article");
const authMiddleware = require("../middlewares/auth-middleware");

router.use("/comments", commentsRouter);

router.get("/", async (req, res) => {
  const articles = await Article.find({});
  res.send(articles);
});

router.get("/:articleId", async (req, res) => {
  res.render("detail");
});

router.delete("/:articleId", authMiddleware, async (req, res) => {
  const { articleId } = req.params;
  const { nickname } = res.locals.user;

  const article = await Article.findById(articleId);

  if (!article) {
    res.status(400).send({ message: "존재하지 않는 게시물입니다." });
    return;
  } else if (article.nickname != nickname) {
    res
      .status(401)
      .send({ message: "다른 사용자의 게시물은 삭제할 수 없습니다." });
    return;
  }

  await Article.deleteOne({ _id: articleId });
  res.send({});
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
