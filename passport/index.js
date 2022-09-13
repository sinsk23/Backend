const passport = require("passport");
const { profile } = require("winston");
const KakaoStrategy = require("passport-kakao").Strategy;
const NaverStrategy = require("passport-naver").Strategy;
const { User } = require("../models");
require("dotenv").config();

module.exports = (app) => {
  app.use(passport.initialize()); // passport를 초기화 하기 위해서 passport.initialize 미들웨어 사용
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: process.env.KAKAO_URL, // 카카오 로그인 Redirect URI 경로
      },
      // clientID에 카카오 앱 아이디 추가
      // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
      // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
      // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 카카오 플랫폼에서 로그인 했고 & 회원 DB(사용자)에 이미 있는 이메일 경우
          const emailCheck = await User.findOne({
            where: {
              email: profile._json.kakao_account.email,
              provider: "kakao",
            },
          });
          // 이미 가입된 카카오 프로필이면 성공
          if (emailCheck) {
            done(null, { emailCheck, accessToken });
          } else {
            // 가입되어 있지 않으면 로그인 정보만 전달
            const newUser = {
              email: profile._json && profile._json.kakao_account.email,
              provider: "kakao",
              nickname: profile.displayName,
              accessToken,

              image: profile._json.properties.profile_image,

            };
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
  // 네이버 소셜 로그인
  // 약관에 동의 하지 않아도 로그인이 가능하기 때문에 해당 상황에 대응하는걸 구현해야함
  passport.use(
    new NaverStrategy(
      {
      clientID: process.env.NAVER_ID, 
      clientSecret: process.env.NAVER_SECRET, 
      callbackURL: process.env.NAVER_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try{
          const emailCheck = await User.findOne({
            where: {
              email: profile._json.naver_account.email,
              provider: "naver",
            },
          });
          if (emailCheck) {
            done(null, { emailCheck, accessToken });
          } else {
            const newUser = {
              email: profile._json && profile._json.naver_account.email,
              provider: "naver",
              nickname: profile.nickname,
              accessToken,

              image: profile._json.properties.profile_image,

            };
            done(null, newUser);
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  )
};

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
