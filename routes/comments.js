const express = require("express");
const router = express.Router();
const Comment = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = new Comment();

router.route("/:postId").post(authMiddleware, CommentController.insertComment);
router
  .route("/:postId/:pagenum")
  .get(authMiddleware, CommentController.getComment);

router
  .route("/:commentId")
  .put(authMiddleware, CommentController.editComment)
  .delete(authMiddleware, CommentController.deleteComment);



router
  .route("/recomment/:commentId")
  .post(authMiddleware, CommentController.insertRecomment);
router
  .route("/recomment/:commentId/:pagenum")
  .get(authMiddleware, CommentController.getRecomment);
router
  .route("/:commentId/:recommentId")
  .put(authMiddleware, CommentController.editRecomment)
  .delete(authMiddleware, CommentController.deleteRecomment);

module.exports = router;
