const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users.controller");
const userController = new UserController();

router.post("/user/distance", userController.addDistance);

module.exports = router;
