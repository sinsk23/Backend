const LikeService = require("../services/likes.service");
let BadRequestError = require("./http-errors").BadRequestError;
class LikeController {
  likeService = new LikeService();
  pushLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;

      if (!postId) {
        throw BadRequestError("postId is required");
      }
      const pushLike = await this.likeService.pushLike(postId, userId);
      res.status(200).json(pushLike);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  isLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      const isLike = await this.likeService.isLike(postId, userId);
      res.status(200).json(isLike);
    } catch (error) {
      next(error);
    }
  };
}
module.exports = LikeController;
