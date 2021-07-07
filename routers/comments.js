const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const Comment = require("../models/comment");
const router = express.Router();

router.get("/", async (req, res) => {
  const comments = await Comment.find({});
  res.send(comments);
});

router.post("/", authMiddleware, async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  const { nickname } = res.locals.user;

  try {
    await Comment.create({ nickname, articleId, content });
  } catch (error) {
    res.status(400).send({ message: "잘못된 요청입니다" });
    return;
  }

  res.send({});
});

module.exports = router;
