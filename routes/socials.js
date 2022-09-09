const express = require("express");
const router = express.Router();
const passport = require("passport");

const SocialController = require("../controllers/socials.controller");

const socialController = new SocialController();

// GET: /api/kakao/login 카카오 로그인 
router.get("/kakao/login", passport.authenticate("kakao"));
// GET: /api/kakao/callback 카카오 로그인 이후 콜백
router.get("/kakao/callback", socialController.kakaologin);
// GET: /api/kakao/logout
router.get("/kakao/logout", socialController.kakaologout);
// router.post("/join", socialController.createAccount);

module.exports = router;
