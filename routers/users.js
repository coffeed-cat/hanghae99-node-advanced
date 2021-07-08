const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SHA256 = require("crypto-js/sha256");
const SECRET_KEY = require("../config/secretkey");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const signupValidator = require("../middlewares/signup-validator");

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", async (req, res) => {
  let { id, password } = req.body;
  password = SHA256(password).toString();
  const user = await User.findOne({ id, password }); // 무조건 아이디랑 비밀번호 둘 다 맞아야 함

  if (!user) {
    res.status(401).send({ error: "아이디 또는 비밀번호를 확인해주세요." });
    return;
  }

  const token = jwt.sign({ userId: user.userId }, SECRET_KEY);
  res.status(201).send({ token });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", signupValidator, async (req, res) => {
  let { id, nickname, password, confirmPassword } = req.body;
  password = SHA256(password).toString();
  await User.create({ id, nickname, password });

  res.status(201).send({});
});

router.get("/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({ user });
});

module.exports = router;
