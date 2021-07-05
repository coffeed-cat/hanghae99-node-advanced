const express = require("express");
const router = express.Router();
const usersRouter = require("./users");

router.use("/users", usersRouter);

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;
