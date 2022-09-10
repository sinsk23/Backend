const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/likes.controller");
const likeController = new LikeController();
const authMiddleware = require("../middlewares/auth-middleware");
router.put("/like/:postId", authMiddleware, likeController.pushLike);
router.get("/like/isLike/:postId", authMiddleware, likeController.isLike);
module.exports = router;
