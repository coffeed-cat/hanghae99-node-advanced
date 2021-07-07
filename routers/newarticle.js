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

module.exports = router;
