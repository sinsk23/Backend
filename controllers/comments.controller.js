const CommentService = require("../services/comments.service");
const { Comment ,ReComment ,Post} = require("../models");
const { Op } = require("sequelize");
let count = 0;

class CommentController {
  commentService = new CommentService();
  // router.get('/users/:id', function(req, res) {
  //   console.log(req.params, req.query);
  //   });
  //ex) /users/123?limit=5&skip=10
  //req.params 의 객체 {id : 123} , req.query 의 객체 {limit:'5', skip:'10'}
  //쿼리스트링은 문자열 parseInt로 정수만들고,Math.max limit,page가 최소 1인 양수
  // 쿼리/api/comment/?postId=1
  // offset : Skip, limit : 값만큼만 보여줌
  // order :[['title','DESC']] //ASC오름차순 기본 댓글순서//DESC내림차순 최신순
  //댓글조회 페이지네이션 테스트
  // getCommentT = async (req, res, next) => {
  //   const { postId } = req.query;

  //   console.log(count);

  //   const inPostid = await Comment.findAll({
  //     where: { postId },
  //     order: [["createdAt", "ASC"]],
  //     limit: 2,
  //     offset: count,
  //   });
  //   count += 2;
  //   console.log(count);
  //   return res.status(200).json({ Comment: inPostid });
  // };

  //댓글 작성 /api/comment/:postId
  insertComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      // console.log(res.locals);
      // console.log(user.userId);
      const { postId } = req.params;
      const { comment } = req.body;
      
      await this.commentService.createComment(
        comment,
        postId,
        user.userId,
        user.nickname,
        user.image

      );

      return res.status(201).json({ result : true });
    } catch (error) {
      next(error);
    }
  };

  //댓글 조회 /api/comment/:postId
  getComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId, pagenum } = req.params;
      const getPostid = await this.commentService.findPostid(postId);
      const count = await Comment.count({where : {postId}});
      const inPostid = await this.commentService.findinPostid(
        postId, 
        pagenum, 
        user.userId,
        user.nickname,
        user.image,
        
      );

      return res.status(200).json({ Comment : inPostid ,count});
    } catch (error) {
      next(error);
    }
  };

  //댓글 수정 /api/comment/:commentId
  editComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId } = req.params;
      const { comment } = req.body;

      await this.commentService.editComment(
        user.userId,
        commentId,
        comment,
        );

      return res.status(201).json({ result: true });
    } catch (error) {
      next(error);
    }
  };
  //댓글 삭제 /api/comment/:commentId
  deleteComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId } = req.params;

      await this.commentService.deleteComment(user.userId, commentId);

      return res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };

  //대 ~ 댓글 ~~~
  //대댓글 작성 /api/comment/:commentId/:recommentId
  insertRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, recommentId } = req.params;
      const { comment } = req.body;

      await this.commentService.createRecomment(
        comment,
        commentId,
        recommentId,
        user.userId,
        user.nickname,
        user.image
      );
      return res.status(201).json({ result : true });
    } catch (error) {
      next(error);
    }
  };
  //대댓글 조회 /api/comment/:commentId/:recommentId
  getRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, recommentId, pagenum } = req.params;
      const getCommentid = await this.commentService.findCommentid(commentId);
      const inRecommentid = await this.commentService.findinCommentid(
        recommentId,
        commentId,
        pagenum,
        user.userId,
        user.nickname,
        user.image
      );
      const count = await ReComment.count({where : {commentId}});

      return res
        .status(200)
        .json({ Recomment : inRecommentid,count });
    } catch (error) {
      next(error);
    }
  };
  //대댓글 수정 /api/comment/:commentId/:recommentId
  editRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      console.log("대댓글 수정쪽 :", user);
      const { commentId, recommentId } = req.params;
      const { comment } = req.body;

      await this.commentService.editRecomment(
        user.userId,
        commentId,
        recommentId,
        comment
      );

      return res.status(201).json({ result: true });
    } catch (error) {
      next(error);
    }
  };
  //대댓글 삭제 /api/comment/:commentId/:recommentId
  deleteRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, recommentId } = req.params;
      await this.commentService.deleteRecomment(
        user.userId,
        commentId,
        recommentId
      );
      return res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = CommentController;
