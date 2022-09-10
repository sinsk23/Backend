const likeRepository = require("../repositories/likes.repositories");
let BadRequestError = require("./http-errors").BadRequestError;
class LikeService {
  likeRepository = new likeRepository();

  pushLike = async (postId, userId) => {
    if (!postId) {
      throw BadRequestError("postId is required");
    }
    const pushLike = await this.likeRepository.pushLike(postId, userId);
    return pushLike;
  };
  isLike = async (postId, userId) => {
    const isLike = await this.likeRepository.isLike(postId, userId);
    return isLike;
  };
}
module.exports = LikeService;
