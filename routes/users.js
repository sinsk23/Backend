const express = require("express");
const router = express.Router();
const passport = require("passport");

const SocialuserController = require("../controllers/users.controller");

const socialuserController = new SocialuserController();
/**/
router.get("/kakao", passport.authenticate("kakao"));
router.get("/auth/kakao/callback", socialuserController.kakaologin);
router.post("/join", socialuserController.createAccount);
router.post("/user/signup", socialuserController.signUp);
router.post("/user/distance", socialuserController.addDistance);
router.post("/user/post/:nickname/:pagenum", socialuserController.getUserPost);
router.get("/user/search", socialuserController.searchUser);
router.post("/user/goal", socialuserController.setGoal);
router.put("/user/profile", socialuserController.changeProfile);
module.exports = router;
