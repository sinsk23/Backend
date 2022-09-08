const CommentRepository = require("./repositories/comments.repository");
const postRepository = require("./repositories/posts.repository");
const commentRepository = new CommentRepository();
const PostRepository = new postRepository();
InitializerCommentdata = async () => {
  //post 2개생성
  for (let i = 0; i < 2; i++) {
    PostRepository.createPost("내용" + i, 10, 10, 10, 10, "img", "hashtag", 1);
    // .then((e) => console.log(e));
  }
  //comment 21개 생성
  for (let i = 0; i < 21; i++) {
    commentRepository.createComment("내용" + i, 1, 1);
    //   .then((e) => console.log(e));
  }
  for (let i = 0; i < 21; i++) {
    commentRepository.createRecomment("내용" + i, 1, 1);
  }
};
module.exports = InitializerCommentdata;
