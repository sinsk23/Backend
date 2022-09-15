require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models");
const axios = require("axios");
class SocialController {
  kakaologin = (req, res, next) => {
    passport.authenticate(
      "kakao",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) return next(err);

        const { email, nickname, accessToken, refreshToken, image, provider } =
          user;
        console.log(
          "악세스토큰",
          email,
          nickname,
          accessToken,
          refreshToken,
          image,
          provider
        );
        const emailCheck = async (email) => {
          const emailCheck = await User.findOne({ where: { email } });

          if (emailCheck) {
            const token = jwt.sign(
              {
                email: email,
                nickname: emailCheck.nickname,

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
              userId: emailCheck.userId,
              member: true,
              message: "success",
            });
          } else {
            return res.status(200).json({
              image,
              email,
              provider,
              nickname,
              accessToken,
              member: false,
            });
          }
        };
        emailCheck(email);
      }
    )(req, res, next);
  };
  kakaologout = async (req, res, next) => {
    const access_token =
      "QpPQh_KPFb6Bgb26FcoRs6K6Z2bGy4iv7ZFkyGApCinJYAAAAYNCCg9f";
    try {
      const unlink = await axios({
        //Promise 객체를 unlink에 넘겨주고
        method: "POST",
        url: "https://kapi.kakao.com/v1/user/unlink",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  naverlogin = (req, res, next) => {
    passport.authenticate(
      "naver",
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
