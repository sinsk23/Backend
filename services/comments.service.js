const CommentRepository = require("../repositories/comments.repository");

class CommentService {
  commentRepository = new CommentRepository();
  //Serv 특정 게시글의 postId조회
  findPostid = async (postId) => {
    return await this.commentRepository.findPostid(postId);
  };

  //Serv 특정 게시글에 댓글 작성
  createComment = async (comment, postId, userId) => {
    return await this.commentRepository.createComment(comment, postId, userId);
  };
  //Serv 특정 게시글의 전체댓글 postId조회
  findinPostid = async (postId) => {
    return await this.commentRepository.findinPostid(postId);
  };
  //Serv 특정 게시글에 댓글 수정
  editComment = async (commentId, comment) => {
    return await this.commentRepository.editComment(commentId, comment);
  };
  //Serv 특정 게시글에 댓글 삭제
  deleteComment = async (commentId) => {
    return await this.commentRepository.deleteComment(commentId);
  };
  //Serv 특정 댓글 조회
  findCommentid = async (commentId) => {
    return await this.commentRepository.findCommentid(commentId);
  };
  //Serv 댓글에 대댓글 작성
  createRecomment = async (comment, userId, commentId, recommentId) => {
    return await this.commentRepository.createRecomment(
      comment,
      userId,
      commentId,
      recommentId
    );
  };
  //Serv 특정 댓글의 전체 대댓글 조회
  findinCommentid = async (recommentId) => {
    return await this.commentRepository.findinCommentid(recommentId);
  };
  //Serv 특정 대댓글 수정
  editRecomment = async (commentId, recommentId, comment) => {
    return await this.commentRepository.editRecomment(
      commentId,
      recommentId,
      comment
    );
  };
  //Serv 특정 대댓글 삭제
  deleteRecomment = async (commentId, recommentId) => {
    return await this.commentRepository.deleteRecomment(commentId, recommentId);
  };
}

module.exports = CommentService;
