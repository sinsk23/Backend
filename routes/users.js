const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

const userController = new UserController();

router.post("/user/signup", userController.signUp);
router.post("/user/checknick", userController.checkNick);
router.post("/user/distance", AuthMiddleware, userController.addDistance);
router.get(
  "/user/post/:nickname/:pagenum",
  AuthMiddleware,
  userController.getUserPost
);
router.delete("/user", AuthMiddleware, userController.deleteUser);
router.get("/user/search", AuthMiddleware, userController.searchUser);
router.post("/user/goal", AuthMiddleware, userController.setGoal);
router.put("/user/image", AuthMiddleware, userController.changeImage);

module.exports = router;
