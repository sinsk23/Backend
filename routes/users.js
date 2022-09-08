const express = require("express");
const router = express.Router();
const passport = require("passport");

const SocialuserController = require("../controllers/users.controller");

const socialuserController = new SocialuserController();
/**/
router.get("/kakao", passport.authenticate("kakao"));
router.get("/auth/kakao/callback", socialuserController.kakaologin);
router.post("/join", socialuserController.createAccount);
module.exports = router;
