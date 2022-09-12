const express = require("express");
const router = express.Router();
const PostController = require("../controllers/posts.controller");
const postController = new PostController();
const authMiddleware = require("../middlewares/auth-middleware");
router.get("/post/search/:pagenum", authMiddleware, postController.searchPost);
router.get(
  "/post/likesearch/:pagenum",
  authMiddleware,
  postController.searchLikePost
);
router.get(
  "/post/popular/:pagenum",
  authMiddleware,
  postController.getLikeAllPosts
);
router.get("/post/autocomplete", authMiddleware, postController.autoSearchPost);
router.post("/post", authMiddleware, postController.createPost);
router.get("/post/new/:pagenum", authMiddleware, postController.getAllPosts);
router.get(
  "/post/:postId",
  authMiddleware,

  postController.getPost
);
router.put("/post/:postId", authMiddleware, postController.updatePost);
router.delete("/post/:postId", authMiddleware, postController.deletePost);

module.exports = router;
