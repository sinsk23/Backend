const LikeService = require("../services/likes.service");

class LikeController {
  likeService = new LikeService();
  pushLike = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;

      const pushLike = await this.likeService.pushLike(postId, user.userId);
      res.status(200).json(pushLike);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  isLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user } = res.locals;
      const isLike = await this.likeService.isLike(postId, user.userId);
      res.status(200).json(isLike);
    } catch (error) {
      next(error);
    }
  };
}
module.exports = LikeController;
