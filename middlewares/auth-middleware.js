const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ result: false, error: "로그인이 필요합니다1." });

    return;
  }

  try {
    console.log("!!!!", jwt.verify(token, process.env.MYSECRET_KEY));
    const { userId } = jwt.verify(token, process.env.MYSECRET_KEY); // userId 는 jwt.sign(userId : user._id)의 user._id가 할당된다.
    console.log("유저ㅏ읻", userId);
    User.findByPk(userId).then((user) => {
      console.log("텟트ㅡ입니다", user);
      res.locals.user = user;

      next();
    });
  } catch (error) {
    res.status(401).json({ result: false, error: "로그인이 필요합니다2." });

    return;
  }
};
