const express = require("express");
const Article = require("../models/article");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/", (req, res) => {
  res.render("newarticle");
});

router.post("/", authMiddleware, async (req, res) => {
  const { date, title, content } = req.body;
  const { nickname } = res.locals.user;

  console.log(date, title, content, nickname);

  let article = null;

  try {
    article = await Article.create({ date, nickname, title, content });
  } catch (error) {
    res.status(401).send({ error });
    return;
  }

  res.status(201).send({ articleId: article._id });
});

router.patch("/:articleId", authMiddleware, async (req, res) => {
  const { articleId } = req.params;
  const { lastFixDate, title, content } = req.body;
  const { nickname } = res.locals.user;

  const article = await Article.findById(articleId);

  if (article.nickname != nickname) {
    res.status(401).send({ message: "다른 사용자의 글은 수정할 수 없습니다." });
    return;
  }

  try {
    await Article.updateOne(
      { _id: articleId },
      { $set: { lastFixDate, title, content } }
    );
  } catch (error) {
    res.status(400).send({ message: "게시글 수정에 실패했습니다." });
  }

  res.send({});
});

module.exports = router;
