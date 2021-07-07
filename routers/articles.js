const express = require("express");
const router = express.Router();
const commentsRouter = require("./comments");
const Article = require("../models/article");
const Comment = require("../models/comment");
const authMiddleware = require("../middlewares/auth-middleware");

// router.use("/:articleId/comments", commentsRouter);

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

router.get("/:articleId/comments", async (req, res) => {
  const { articleId } = req.params;
  const comments = await Comment.find({ articleId });
  res.send(comments);
});

router.post("/:articleId/comments", authMiddleware, async (req, res) => {
  const { articleId } = req.params;
  const { date, content } = req.body;
  const { nickname } = res.locals.user;

  try {
    await Comment.create({ articleId, nickname, content, date });
  } catch (error) {
    res.status(400).send({ message: "잘못된 요청입니다" });
    return;
  }

  res.send({});
});

router.patch(
  "/:articleId/comments/:commentsId",
  authMiddleware,
  async (req, res) => {
    const { articleId, commentsId } = req.params;
    const { content } = req.body;
    const { nickname } = res.locals.user;

    const comment = await Comment.findById(commentsId);

    if (comment.nickname != nickname) {
      res
        .status(401)
        .send({ message: "다른 사용자의 댓글은 삭제할 수 없습니다." });
      return; // 다른 사용자의 댓글삭제를 요청한 경우
    }

    if (comment.articleId != articleId) {
      res.status(400).send({ message: "잘못된 요청입니다.." });
      return; // 다른 글의 댓글삭제를 요청한 경우
    }

    try {
      await Comment.updateOne({ _id: commentId }, { $set: { content } });
    } catch (error) {
      res.status(400).send({ message: "잘못된 요청입니다" });
      return; // DB에서 업데이트하는 중 오류가 생겼을 경우
    }

    res.send({});
  }
);

module.exports = router;
