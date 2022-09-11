const CommentRepository = require("./repositories/comments.repository");
const postRepository = require("./repositories/posts.repository");
const commentRepository = new CommentRepository();
const PostRepository = new postRepository();
InitializerCommentdata = async () => {
  //post 2개생성
  /*content,1
  time,2
  distance,3
  path,4
  speed,5
  image,6
  hashtag,7
  userId,8
  nickname,9
  */
  for (let i = 0; i < 2; i++) {
    PostRepository.createPost("내용" + i, 10, 10, 10, 10, "img", "hashtag", 1,"닉네임"+i);
    // .then((e) => console.log(e));
  }
  //comment 21개 생성
  for (let i = 0; i < 21; i++) {
    commentRepository.createComment("댓글내용" + i, 1, 1);
    //   .then((e) => console.log(e));
  }
  for (let i = 0; i < 21; i++) {
    commentRepository.createRecomment("대댓글내용" + i, 1, 1, 1+i);
  }
};
module.exports = InitializerCommentdata;
