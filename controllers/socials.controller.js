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


        const emailCheck = async (email) => {
          const emailCheck = await User.findOne({ where: { email } });

          if (emailCheck) {
            const token = jwt.sign(
              {
                email: email,
                nickname: emailCheck.nickname,
                image: image,
                provider: provider,
                userId: emailCheck.userId,
              },
              process.env.MYSECRET_KEY,
              {
                expiresIn: "2d",
              }
            );
            return res.status(200).json({
              token,
              accessToken,
              image,
              email,
              provider,
              nickname: emailCheck.nickname,

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
