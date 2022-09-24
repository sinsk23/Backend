const { Post } = require("../models");
const { Like } = require("../models");

class LikeRepository {
  //포스트아이디와 유저아이디를 받아 유저가 게시글에 좋아요를 누르면 Like 테이블에 유저아이디와 포스트아이디가 저장되는 함수
  pushLike = async (postId, userId) => {
    const test = await Like.findAll({ where: { userId } });
    const pushLike = await Like.create({ userId, postId });
    let likeDone = true;
    for (let i = 0; i < test.length; i++) {
      if (pushLike.userId == test[i].userId) {
        if (pushLike.postId == test[i].postId) {
          likeDone = false;
          await Like.destroy({ where: { postId, userId } });
        }
      }
    }
    const userLike = await Like.findAll({ where: { postId } });
    await Post.update({ like: userLike.length }, { where: { postId } });
    if (likeDone) {
      return true;
    } else {
      return false;
    }
  };
  //포스트 아이디와 유저아이디를 받아 해당 유저가 해당 포스트에 좋아요를 눌렀는지 확인하는 함수
  isLike = async (postId, userId) => {
    const isLike = await Like.findOne({ where: { postId, userId } });
    if (isLike) {
      return true;
    } else {
      return false;
    }
  };
}
module.exports = LikeRepository;
