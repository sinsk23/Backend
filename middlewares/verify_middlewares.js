const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

//토큰이 있다면 해당 토큰을 해석해주는 미들웨어
//없으면 패스됨
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  //토큰이 있을경우
  if (authorization) {
    const [tokenType, tokenValue] = authorization.split(" ");

    try {
      //토큰을 해석
      const privatekey = jwt.verify(tokenValue, process.env.secret_key);
      User.findByPk(privatekey.userkey).then((user) => {
        res.locals.user = user;
        next();
      });
      return;
    } catch (err) {
      //토큰 해석 중 오류발생시 (올바르지 않는 토큰일 경우)
      res.status(401).json({
        result: false,
        errormessage: "토큰 유효성 검사에 실패했습니다.",
      });
      return;
    }
  }

  next();
};
