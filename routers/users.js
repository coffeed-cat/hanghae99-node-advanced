const express = require("express");
const router = express.Router();
const User = require("../models/user");
const SHA256 = require("crypto-js/sha256");
const SECRET_KEY = require("../config/secretkey");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");

const signupSchema = Joi.object({
  id: Joi.string().alphanum().min(3).max(30).required(),

  nickname: Joi.string().min(3).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{4,30}$")).required(),

  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

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

router.post("/signup", async (req, res) => {
  let { id, nickname, password, confirmPassword } = req.body;

  // 여기에 joi로 validate 추가할 것
  try {
    await signupSchema.validateAsync(req.body);
    if (password.includes(id)) {
      throw new Error("비밀번호에 ID가 포함되어있습니다.");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
    return;
  }

  const user = await User.findOne({ $or: [{ id }, { nickname }] });

  if (user) {
    res.status(401).send({ error: "이미 존재하는 ID 또는 닉네임입니다." });
    return;
  }

  password = SHA256(password).toString();
  await User.create({ id, nickname, password });

  res.status(201).send({});
});

router.get("/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log(user);
  res.send({ user });
});

module.exports = router;
