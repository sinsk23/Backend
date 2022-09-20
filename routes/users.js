const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

const userController = new UserController();
router.get("/user/search", AuthMiddleware, userController.searchUser);
router.post("/user/signup", userController.signUp);
router.post("/user/check", userController.checkNick);
router.get("/user/rank", userController.getRank);
router.get("/user/research", AuthMiddleware, userController.getResearch);
router.put("/user/research", AuthMiddleware, userController.changeResearch);
router.get("/user/goal", AuthMiddleware, userController.checkGoal);
router.post("/user/distance", AuthMiddleware, userController.addDistance);
router.get(
  "/user/post/:nickname/:pagenum",
  AuthMiddleware,
  userController.getUserPost
);
router.get("/user/:userId", AuthMiddleware, userController.getUserInfo);
router.delete("/user", AuthMiddleware, userController.deleteUser);

router.post("/user/goal", AuthMiddleware, userController.setGoal);
router.put("/user/goal", AuthMiddleware, userController.changeGoal);
router.put("/user/image", AuthMiddleware, userController.changeImage);
router.post("/user/location", AuthMiddleware, userController.sendLocation);

module.exports = router;
