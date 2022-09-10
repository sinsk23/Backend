const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controller");
const AuthMiddleware = require("../middlewares/auth-middleware");

const userController = new UserController();

router.post("/user/signup", userController.signUp);
router.post("/user/distance", userController.addDistance);
router.post("/user/post/:nickname/:pagenum", userController.getUserPost);
router.get("/user/search", userController.searchUser);
router.post("/user/goal", userController.setGoal);
router.put("/user/profile", userController.changeProfile);

module.exports = router;
