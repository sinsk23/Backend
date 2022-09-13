const { Comment, Post, User, ReComment } = require("../models");
const { Op } = require("sequelize");
// let count = 0;
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
  //Repo 특정 게시글의 전체댓글 postId조회
  /**
   * @todo 유저와 연결 후 nickname,image,count 추가해주기 2가지 경우로~ 1. 매서드findAndCountAll 그러면 프론트 불편, 2. count매서드?
   * 
   * @param {integer}postId 게시글 아이디 번호 넣기 
   * @param {number}pagenum 페이지 끊어 보여주기 ex)offset = 5 * (pagenum - 1);
   * @param offset skip
   * @param limit 댓글수 제한적 보여주기 
   * @returns 게시글에 전체 댓글을 보여줌
   */
  findinPostid = async (postId,pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const inPostid = await Comment.findAll({
      where: { postId },
      include:{ model : User, attributes:["nickname","image"] , required: true},
      order: [["createdAt", "ASC"]],
      limit: 5,
      offset: offset,
    });
    const count = await Comment.count({where : {postId}});
    const commentData = inPostid.map((e)=>{
      return{
        commentId: e.commentId,
        comment: e.comment,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        postId: e.postId,
        userId: e.User.userId,
        nickname: e.User.nickname,
        image: e.User.image,
        
      }
    })
    // return inPostid;
    return {commentData,count};
  };

  //Repo 특정 게시글에 댓글 수정
  editComment = async (userId, commentId, comment) => {
    return await Comment.update({ comment }, { where: { userId, commentId } });
  };
  //Repo 특정 게시글에 댓글 삭제
  deleteComment = async (userId,commentId) => {
    return await Comment.destroy({ where: { userId,commentId } });
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
  findinCommentid = async (recommentId,commentId,pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const inRecommentid = await ReComment.findAll({
      where: { commentId },
      include:{model : User, attributes:["nickname","image"]},
      order: [["createdAt", "ASC"]],
      limit: 5,
      offset: offset,
      
    });
    const count = await ReComment.count({where : {commentId}});
    const recommentData = inRecommentid.map((e)=>{
      return{recommentId:e.recommentId,
        comment: e.comment,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        commentId: e.commentId,
        userId: e.User.userId,
        nickname: e.User.nickname,
        image: e.User.image
        
      }
    })
    
    // return inRecommentid;
    return {recommentData,count};
    
  };
  //Repo 특정 대댓글 수정
  editRecomment = async (userId, commentId,recommentId, comment) => {
    return await ReComment.update({ comment }, { where: { userId, commentId,recommentId } });

  };
  //Repo 특정 대댓글 삭제
  deleteRecomment = async (userId, commentId, recommentId) => {
    return await ReComment.destroy({ where: { userId, commentId, recommentId } });
  };
}
module.exports = CommentRepository;
