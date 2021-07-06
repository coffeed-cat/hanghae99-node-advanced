const express = require("express");
const Article = require("../models/article");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("newarticle");
});

router.post("/", async (req, res) => {
  const { date, title, content } = req.body;
  const { nickname } = res.locals.user;

  try {
    await Article.create({ date, nickname, title, content });
  } catch (error) {
    res.status(401).send({ error });
    return;
  }

  res.status(201).send({});
});

module.exports = router;
