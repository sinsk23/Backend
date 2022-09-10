const express = require("express");
const router = express.Router();
const PostController = require("../controllers/posts.controller");
const postController = new PostController();
const authMiddleware = require("../middlewares/auth-middleware");
router.get("/post/search/:pagenum", postController.searchPost);
router.get("/post/likesearch/:pagenum", postController.searchLikePost);
router.post("/post/likeorder/:pagenum", postController.getLikeAllPosts);
router.get("/post/autoSearch", postController.autoSearchPost);
router.post("/post", postController.createPost);
router.post("/post/scroll/:pagenum", postController.getAllPosts);
router.get("/post/:postId", authMiddleware, postController.getPost);
router.put("/post/:postId", postController.updatePost);
router.delete("/post/:postId", postController.deletePost);

module.exports = router;
