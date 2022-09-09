const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

const userController = new UserController();
/**/

router.post("/user/signup", userController.signUp);
router.post("/user/distance", userController.addDistance);
router.post("/user/post/:nickname/:pagenum", userController.getUserPost);
router.get("/user/search", userController.searchUser);
router.post("/user/goal", userController.setGoal);
router.put("/user/profile", userController.changeProfile);

// POST : /api/user 회원가입
router.post("/", userController.createUser);
// PUT : /api/user 회원정보 수정
router.put("/", AuthMiddleware, userController.updateUser);
// POST : /api/user/check 중복 체크
router.post("/check", userController.duplicateCheck);

module.exports = router;
