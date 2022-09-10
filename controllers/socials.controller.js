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

        const { email, nickname, accessToken, image, provider } = user;

        const jwtToken = jwt.sign(
          { email, nickname, image, provider },

          process.env.MYSECRET_KEY,
          {
            expiresIn: "2d",
          }
        );


        res.status(200).json({
          image,
          jwtToken,
          accessToken,
          email,
          provider,
          nickname,
          
          message: "success",
        });

        const emailCheck = async (email) => {
          const emailCheck = await User.findOne({ email });
          console.log("테스트", emailCheck);
          if (emailCheck) {
            return res.status(200).json({
              jwtToken,
              accessToken,
              image,
              email,
              provider,
              nickname,
              member: true,
              message: "success",
            });
          } else {
            return res.status(200).json({
              image,
              email,
              provider,
              nickname,
              member: false,
            });
          }
        };
        emailCheck(email);

      }
    )(req, res, next);
  };
}

module.exports = SocialController;
