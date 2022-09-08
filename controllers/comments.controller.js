const CommentService = require("../services/comments.service");
const { Comment } = require("../models");
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
    const { userId } = res.locals.userId;
    const { postId } = req.params;
    const { comment } = req.body;

    const commentData = await this.commentService.createComment(
      comment,
      postId,
      userId
    );

    return res.status(201).json({ data: commentData });
  };

  //댓글 조회 /api/comment/:postId
  getComment = async (req, res, next) => {
    const { postId } = req.params;
    const getPostid = await this.commentService.findPostid(postId);

    const inPostid = await this.commentService.findinPostid(postId);

    return res.status(200).json({ Post: [getPostid], Comment: [inPostid] });
  };

  //댓글 수정 /api/comment/:commentId
  editComment = async (req, res, next) => {
    const { userId } = res.locals.userId;
    const { commentId } = req.params;
    const { comment } = req.body;

    await this.commentService.editComment(commentId, comment);

    return res.status(201).json({ result: true });
  };
  //댓글 삭제 /api/comment/:commentId
  deleteComment = async (req, res, next) => {
    const { userId } = res.locals.userId;
    const { commentId } = req.params;

    await this.commentService.deleteComment(commentId);

    return res.status(200).json({ result: true });
  };

  //대 ~ 댓글 ~~~
  //대댓글 작성 /api/comment/:commentId/:recommentId
  insertRecomment = async (req, res, next) => {
    const { userId } = res.locals.userId;
    const { commentId, recommentId } = req.params;
    const { comment } = req.body;

    const recommentData = await this.commentService.createRecomment(
      comment,
      userId,
      commentId,
      recommentId
    );
    return res.status(201).json({ data: recommentData });
  };
  //대댓글 조회 /api/comment/:commentId/:recommentId
  getRecomment = async (req, res, next) => {
    const { commentId, recommentId } = req.params;
    const getCommentid = await this.commentService.findCommentid(commentId);
    const inRecommentid = await this.commentService.findinCommentid(
      recommentId
    );

    return res
      .status(200)
      .json({ Comment: [getCommentid], ReComment: [inRecommentid] });
  };
  //대댓글 수정 /api/comment/:commentId/:recommentId
  editRecomment = async (req, res, next) => {
    const { userId } = res.locals.userId;
    const { commentId, recommentId } = req.params;
    const { comment } = req.body;

    await this.commentService.editRecomment(commentId, recommentId, comment);

    return res.status(201).json({ result: true });
  };
  //대댓글 삭제 /api/comment/:commentId/:recommentId
  deleteRecomment = async (req, res, next) => {
    const { userId } = res.locals.userId;
    const { commentId, recommentId } = req.params;
    await this.commentService.deleteRecomment(commentId, recommentId);
    return res.status(200).json({ result: true });
  };
}

module.exports = CommentController;
