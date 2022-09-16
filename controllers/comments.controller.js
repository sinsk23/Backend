const CommentService = require("../services/comments.service");
const { Comment, ReComment, Post } = require("../models");
const { Op } = require("sequelize");

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

  //댓글 조회 /api/comment/:postId
  getComment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId, pagenum } = req.params;
      const getPostid = await this.commentService.findPostid(postId);
      // const count = await Comment.count({ where: { postId } });
      //댓글에 대댓글 개수 프론트에서 요청으로 바꿈

      const inPostid = await this.commentService.findinPostid(
        postId,
        pagenum,
        user.userId,
        user.nickname,
        user.image
      );

      return res.status(200).json({ Comment: inPostid });
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
  //댓글 삭제 /api/comment/:commentId
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

  //대 ~ 댓글 ~~~
  //대댓글 작성 /api/comment/recomment/:commentId
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
  //대댓글 조회 /api/comment/recomment/:commentId/:pagenum
  getRecomment = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { commentId, pagenum } = req.params;

      const inRecommentid = await this.commentService.findinCommentid(
        commentId,
        pagenum,
        user.userId,
        user.nickname,
        user.image
      );
      // const count = await ReComment.count({ where: { commentId } });

      return res.status(200).json({ Recomment: inRecommentid });
    } catch (error) {
      next(error);
    }
  };
  //대댓글 수정 /api/comment/:commentId/:recommentId
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
  //대댓글 삭제 /api/comment/:commentId/:recommentId
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
