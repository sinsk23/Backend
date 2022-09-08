const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const userController = new UserController();
router.post("/user/signup", userController.signUp);
router.post("/user/distance", userController.addDistance);
router.post("/user/post/:nickname/:pagenum", userController.getUserPost);
router.get("/user/search", userController.searchUser);
router.post("/user/goal", userController.setGoal);
router.put("/user/profile", userController.changeProfile);

const passport = require("passport");

const SocialuserController = require("../controllers/users.controller");

const socialuserController = new SocialuserController();

router.get("/kakao", passport.authenticate("kakao"));
router.get("/auth/kakao/callback", socialuserController.kakaologin);
router.post("/join", socialuserController.createAccount);

module.exports = router;
