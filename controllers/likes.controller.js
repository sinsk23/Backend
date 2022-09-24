const LikeService = require("../services/likes.service");

class LikeController {
  likeService = new LikeService();
  //클라이언트로부터 유저아이디와 포스트아이디를 받아 likeService.pushLike()함수에 유저아이디와 포스트아이디를 리턴하는 함수
  pushLike = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { postId } = req.params;

      const pushLike = await this.likeService.pushLike(postId, user.userId);
      res.status(200).json(pushLike);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트루부터 유저아이디와 포스트아이디를 받아  likeService.isLike()함수에 유저아이디와 포스트아이디를 리턴하는 함수
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
