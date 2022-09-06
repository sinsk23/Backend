const { Comment, Post, User, ReComment } = require("../models");
const { Op } = require("sequelize");
let count = 0;
class CommentRepository {
  //Repo 특정 게시글 postId 조회
  findPostid = async (postId) => {
    return await Post.findOne({ where: { postId } });
  };
  //Repo 특정 게시글에 댓글 작성
  createComment = async (comment, postId, userId) => {
    return await Comment.create({
      comment,
      postId,
      userId,
    });
  };
  //Repo 특정 게시글의 전체댓글 postId조회 //페이지네이션연습
  findinPostid = async (postId) => {
    const inPostid = await Comment.findAll({
      where: { postId },
      order: [["createdAt", "ASC"]],
      limit: 2,
      offset: count,
    });
    count += 2;
    return inPostid;
  };

  //Repo 특정 게시글에 댓글 수정
  editComment = async (commentId, comment) => {
    return await Comment.update({ comment }, { where: { commentId } });
  };
  //Repo 특정 게시글에 댓글 삭제
  deleteComment = async (commentId) => {
    return await Comment.destroy({ where: { commentId } });
  };
  //Repo 특정 댓글 조회
  findCommentid = async (commentId) => {
    return await Comment.findOne({ where: { commentId } });
  };
  //Repo 댓글에 대댓글 작성
  createRecomment = async (comment, userId, commentId, recommentId) => {
    return await ReComment.create({ comment, userId, commentId, recommentId });
  };
  //Repo 특정 댓글의 전체 대댓글 조회
  findinCommentid = async (recommentId) => {
    const inRecommentid = await ReComment.findAll({
      where: { recommentId },
      order: [["createdAt", "ASC"]],
      limit: 2,
      offset: count,
    });
    count += 2;
    return inRecommentid;
  };
  //Repo 특정 대댓글 수정
  editRecomment = async (commentId, recommentId, comment) => {
    return await ReComment.update({ comment }, { where: { recommentId } });
  };
  //Repo 특정 대댓글 삭제
  deleteRecomment = async (commentId, recommentId) => {
    return await ReComment.destroy({ where: { recommentId } });
  };
}
module.exports = CommentRepository;
