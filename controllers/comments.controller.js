const CommentService = require("../services/comments.service");


class CommentController {
  commentService = new CommentService();
  

  //댓글 작성
  insertComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      
      const { postId } = req.params;
      const { comment } = req.body;

      const { result, message } = await this.commentService.createComment(
        comment,
        postId,
        user.userId,
        user.nickname,
        user.image
      );
      if (result) {
        return res.status(201).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };

  //댓글 조회 
  getComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId, pagenum } = req.params;

      const getPostid = await this.commentService.findPostid(postId);
      
      let type = false;
      const inPostid = await this.commentService.findinPostid(
        postId,
        pagenum,
        user.userId,
        user.nickname,
        user.image
      );
      if(!inPostid.length){
        type = true;
      }

      return res.status(200).json({ Comment: inPostid ,isLast:type});
    } catch (error) {
      next(error);
    }
  };

  //댓글 수정 
  editComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId } = req.params;
      const { comment } = req.body;

      const { result, message } = await this.commentService.editComment(
        user.userId,
        commentId,
        comment
      );
      if (result) {
        return res.status(201).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };
  //댓글 삭제
  deleteComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId } = req.params;

      const { result, message } = await this.commentService.deleteComment(
        user.userId,
        commentId
      );
      if (result) {
        return res.status(200).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };

  
  //대댓글 작성 
  insertRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, recommentId } = req.params;
      const { comment } = req.body;

      const { result, message } = await this.commentService.createRecomment(
        comment,
        commentId,
        recommentId,
        user.userId,
        user.nickname,
        user.image
      );
      if (result) {
        return res.status(201).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };
  //대댓글 조회 
  getRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, pagenum } = req.params;
      let type = false;
      const inRecommentid = await this.commentService.findinCommentid(
        commentId,
        pagenum,
        user.userId,
        user.nickname,
        user.image
      );

      if(!inRecommentid.length){
        type = true;
      }
      

      return res.status(200).json({ Recomment: inRecommentid, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  //대댓글 수정 
  editRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;

      const { commentId, recommentId } = req.params;
      const { comment } = req.body;

      const { result, message } = await this.commentService.editRecomment(
        user.userId,
        commentId,
        recommentId,
        comment
      );
      if (result) {
        return res.status(201).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };
  //대댓글 삭제 
  deleteRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, recommentId } = req.params;
      const { result, message } = await this.commentService.deleteRecomment(
        user.userId,
        commentId,
        recommentId
      );
      if (result) {
        return res.status(200).json({ result, message });
      } else {
        return res.status(400).json({ result, message });
      }
    } catch (error) {
      next(error);
    }
  };
}
module.exports = CommentController;
