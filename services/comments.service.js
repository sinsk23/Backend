const CommentRepository = require("../repositories/comments.repository");

class CommentService {
  commentRepository = new CommentRepository();
  //Serv 특정 게시글의 postId조회
  findPostid = async (postId) => {
    return await this.commentRepository.findPostid(postId);
  };

  //Serv 특정 게시글에 댓글 작성
  createComment = async (comment, postId, userId, nickname, image) => {
    //댓글 내용이 없으면~
    if (comment === "" || null) {
      return { result: false, message: "댓글을 입력해주세요" };
    }
    //게시글을 찾아 없으면~
    const findPostid = await this.commentRepository.findPostid(postId);
    if (!findPostid) {
      return {
        result: false,
        message: "댓글을 작성할 게시글이 존재하지 않습니다.",
      };
    }
    await this.commentRepository.createComment(comment, postId, userId, nickname, image);
    return { result: true, message: "댓글 작성 완료"}
  };
  //Serv 특정 게시글의 전체댓글 postId조회
  findinPostid = async (postId,pagenum) => {
    const findinPostid = await this.commentRepository.findinPostid(postId,pagenum);
    //게시글에 댓글이 없으면
    if (!findinPostid) {
      return { result: false, message: "게시글에 댓글이 없습니다." };
    }
    return findinPostid;
  };
  //Serv 특정 게시글에 댓글 수정
  editComment = async (userId, commentId, comment) => {
    //댓글 내용이 없으면~
    if (comment === "" || null) {
      return { result: false, message: "댓글을 입력해주세요" };
    }
    const editComment = await this.commentRepository.editComment(
      userId,
      commentId,
      comment
    );
    //수정할 댓글이 없으면~
    if (!editComment) {
      return { result: false, message: "수정 할 댓글이 존재하지 않습니다." };
    }
    return editComment;
  };
  //Serv 특정 게시글에 댓글 삭제
  deleteComment = async (userId, commentId) => {
    const deleteComment = await this.commentRepository.deleteComment(userId, commentId);
    if (!deleteComment) {
      return { result: false, message: "삭제 할 댓글이 존재하지 않습니다." };
    }
    return deleteComment;
  };
  //Serv 특정 댓글 조회
  findCommentid = async (commentId) => {
    const findCommentid = await this.commentRepository.findCommentid(commentId);
    //댓글이 없으면~
    if (!findCommentid) {
      return { result: false, message: "댓글이 존재하지 않습니다" };
    }
    return findCommentid;
  };
  //Serv 댓글에 대댓글 작성
  createRecomment = async (comment, commentId, recommentId,userId,nickname,image) => {
    //댓글 내용이 없으면~
    if (comment === "" || null) {
      return { result: false, message: "댓글을 입력해주세요" };
    }
    //댓글이 없으면~
    const findCommentid = await this.commentRepository.findCommentid(commentId);
    if (!findCommentid) {
      return {
        result: false,
        message: "댓글이 존재하지 않습니다",
      };
    }
    await this.commentRepository.createRecomment(
      comment,
      commentId,
      recommentId,
      userId,
      nickname,
      image
    );
    return { result: true, message: "댓글 작성 완료" }
  };
  //Serv 특정 댓글의 전체 대댓글 조회
  findinCommentid = async (commentId,pagenum) => {
    const findinCommentid = await this.commentRepository.findinCommentid(
      commentId,pagenum
    );
    //대댓글이 없으면~
    if (!findinCommentid) {
      return { result: false, message: "댓글을 입력해주세요" };
    }
    return findinCommentid;
  };
  //Serv 특정 대댓글 수정
  editRecomment = async (userId, commentId, recommentId, comment) => {
    const editRecomment = await this.commentRepository.editRecomment(
      userId,
      commentId,
      recommentId,
      comment
    );
    //특정 대댓글이 없으면
    if (!editRecomment) {
      return {
        result: false,
        message: "대댓글이 존재하지 않아 수정 할 수 없습니다.",
      };
    }
    return editRecomment;
  };
  //Serv 특정 대댓글 삭제
  deleteRecomment = async (userId, commentId, recommentId) => {
    const deleteRecomment = await this.commentRepository.deleteRecomment(
      userId,
      commentId,
      recommentId
    );
    if (!deleteRecomment) {
      return {
        result: false,
        message: "대댓글이 존재하지 않아 삭제 할 수 없습니다.",
      };
    }
    return deleteRecomment;
  };
}

module.exports = CommentService;
