const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

<<<<<<< HEAD
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
=======
const userController = new UserController();

// POST : /api/user 회원가입
router.post("/", userController.createUser);
// PUT : /api/user 회원정보 수정
router.put("/", AuthMiddleware, userController.updateUser);
// POST : /api/user/check 중복 체크
router.post("/check", userController.duplicateCheck);

module.exports = router;
>>>>>>> 소셜로그인제작
