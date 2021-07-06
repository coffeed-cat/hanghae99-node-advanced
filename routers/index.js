const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const articlesRouter = require("./articles");
const newarticleRouter = require("./newarticle");
const authMiddleware = require("../middlewares/auth-middleware");

router.use("/users", usersRouter);
router.use("/articles", articlesRouter);
router.use("/newarticle", newarticleRouter);

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
