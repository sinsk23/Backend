require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models");
class SocialuserController {
  kakaologin = (req, res, next) => {
    passport.authenticate(
      "kakao",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) return next(err);
        const { userId, nickname } = user;

        const token = jwt.sign({ userId, nickname }, process.env.MYSECRET_KEY, {
          expiresIn: "2d",
        });
        res.status(200).json({
          token,
          message: "success",
        });
      }
    )(req, res, next);
  };

  createAccount = async (req, res, next) => {
    const { nickname, profile } = req.body;
    const createUser = await User.create(nickname, profile);
    return res.status(201).json({ createUser });
  };
}

module.exports = SocialuserController;
