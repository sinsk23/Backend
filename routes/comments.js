const express = require("express");
const router = express.Router();
const Comment = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const CommentController = new Comment();
/**나중에 유저에서 include 찾아서 nickname이랑 이미지 image 넣어줘야함
댓글 개수도 표현해줘야함 comment.length??or findandCountAll
*/
// /comment 루트로들어와

// query로 받을때 주소는 "/?"
router
  .route("/:postId")
  .post(authMiddleware,CommentController.insertComment)
router
  .route("/:postId/:pagenum")
  .get(authMiddleware,CommentController.getComment);
router
  .route("/:commentId")
  .put(authMiddleware,CommentController.editComment)
  .delete(authMiddleware,CommentController.deleteComment);

// router.route("/?").get(CommentController.getCommentT);

router
  .route("/:commentId/:recommentId")
  .post(authMiddleware,CommentController.insertRecomment)
router
  .route("/:commentId/:recommentId/:pagenum")  
  .get(authMiddleware,CommentController.getRecomment);
router
  .route("/:commentId/:recommentId")
  .put(authMiddleware,CommentController.editRecomment)
  .delete(authMiddleware,CommentController.deleteRecomment);

module.exports = router;
