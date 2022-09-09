require("dotenv").config();
const jwt = require("jsonwebtoken");
const log = require("../winston");
const passport = require("passport");
const { User } = require("../models");
class SocialController {
  kakaologin = (req, res, next) => {
    passport.authenticate(
      "kakao",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) return next(err);
        const { email, nickname, accessToken, provider } = user;
        console.log("닉네임!!", nickname);
        const jwtToken = jwt.sign(
          { email, nickname, provider },
          process.env.MYSECRET_KEY,
          {
            expiresIn: "2d",
          }
        );

        res.status(200).json({
          jwtToken,
          accessToken,
          email,
          provider,
          nickname,
          member: true,
          message: "success",
        });
      }
    )(req, res, next);
  };

  kakaologout = (req, res, next) => {
    req.session.destroy((err) => {
      req.logout();
      res.redirect("/");
    });
  };
  // createAccount = async (req, res, next) => {
  //   const { nickname, profile } = req.body;
  //   const createUser = await User.create(nickname, profile);
  //   return res.status(201).json({ createUser });
  // };
}

module.exports = SocialController;
