const express = require("express");
const router = express.Router();
const LikeController = require("../controllers/likes.controller");
const likeController = new LikeController();
router.put("/like/:postId", likeController.pushLike);
router.get("/like/isLike/:postId", likeController.isLike);
module.exports = router;
