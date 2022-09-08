const { Post } = require("../models");
const { Like } = require("../models");
const Sequelize = require("sequelize");

const Op = Sequelize.Op;
class LikeRepository {
  pushLike = async (postId, userId) => {
    const post = await Post.findOne({ where: { postId } });
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
  isLike = async (postId, userId) => {
    const isLike = await Like.findOne({ where: { userId, postId } });
    if (isLike) {
      return true;
    } else {
      return false;
    }
  };
}
module.exports = LikeRepository;
