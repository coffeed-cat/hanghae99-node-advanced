const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../secretkey");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  // header는 authorization : 'Bearer token' 형식으로 온다
  // 만약 authorization이 존재하지 않으면 error
  // 있으면 tokenType이랑 token으로 분리
  // token verify해서 db에서 찾아서 나오면 locals에 넣어서 다음 미들웨어로..next()
  // 그렇지 않으면 401로 반환
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ error: "로그인이 필요한 서비스입니다." });
    return;
  }

  const { tokenType, token } = authorization.split("");

  if (tokenType != "Bearer") {
    res.status(401).send({ error: "올바르지 않은 인증요청입니다." });
    return;
  }
  try {
    const { userId } = jwt.verify(token, SECRET_KEY);

    const user = await User.findOne({ userId });

    if (!user) {
      throw new Error("존재하지 않는 회원입니다.");
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error });
    return;
  }
};
