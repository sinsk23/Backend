const express = require("express");
const router = express.Router();
const PostController = require("../controllers/posts.controller");
const postController = new PostController();
router.get("/post/search/:pagenum", postController.searchPost);
router.post("/post/likeorder/:pagenum", postController.getLikeAllPosts);
router.get("/post/autoSearch", postController.autoSearchPost);
router.post("/post", postController.createPost);
router.post("/post/scroll/:pagenum", postController.getAllPosts);
router.get("/post/:postId", postController.getPost);
router.put("/post/:postId", postController.updatePost);
router.delete("/post/:postId", postController.deletePost);

module.exports = router;
