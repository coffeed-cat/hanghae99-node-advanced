const User = require("../models/user");
const Joi = require("joi");

const signupSchema = Joi.object({
  id: Joi.string()
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{5,30}$"))
    .required(),

  nickname: Joi.string().min(3).max(30).required(),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{4,30}$"))
    .required(),

  confirmPassword: Joi.ref("password"),
}).with("password", "confirmPassword");

module.exports = async (req, res, next) => {
  let { id, nickname, password, confirmPassword } = req.body;

  // 여기에 joi로 validate 추가할 것
  try {
    await signupSchema.validateAsync(req.body);
    if (password.includes(id)) {
      res.status(400).send({ message: "비밀번호에 ID가 포함되어있습니다." });
      return;
    }
  } catch (error) {
    res.status(400).send({ message: "입력조건을 확인해주세요." });
    return;
  }

  const user = await User.findOne({ $or: [{ id }, { nickname }] });

  if (user) {
    res.status(401).send({ message: "이미 존재하는 ID 또는 닉네임입니다." });
    return;
  }

  next();
};
