const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();

  createPost = async (req, res, next) => {
    try {
      const {
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag,
        userId,
        nickname,
      } = req.body;

      const createPost = await this.postService.createPost(
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag,
        userId,
        nickname
      );

      res.status(201).json(createPost);
    } catch (error) {
      next(error);
    }
  };
  getAllPosts = async (req, res, next) => {
    try {
      const { pagenum } = req.params;
      const { userId } = req.body;

      let type = false;
      const getAllPosts = await this.postService.getAllPosts(pagenum, userId);

      if (!getAllPosts.length) {
        type = true;
      }
      res.status(200).json({
        Post: getAllPosts,
        isLast: type,
      });
    } catch (error) {
      next(error);
    }
  };
  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      console.log("유저아디", userId);

      const getPost = await this.postService.getPost(postId, userId);

      if (!getPost) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json(getPost);
    } catch (error) {
      next(error);
    }
  };
  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content, time, distance, path, speed, image, hashtag } = req.body;

      const updatePost = await this.postService.updatePost(
        postId,
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag
      );

      if (updatePost[0] === 0) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };
  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;

      const deletePost = await this.postService.deletePost(postId);

      if (deletePost === 0) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json({ result: true });
    } catch (error) {
      next(error);
    }
  };

  getLikeAllPosts = async (req, res, next) => {
    try {
      const { pagenum } = req.params;
      const { userId } = req.body;

      let type = false;
      const getLikeAllPosts = await this.postService.geLikeAllPosts(
        pagenum,
        userId
      );
      if (!getLikeAllPosts.length) {
        type = true;
      }
      res.status(200).json({ Post: getLikeAllPosts, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  searchPost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;
      const searchPost = await this.postService.searchPost(hashtag);
      res.status(200).json({ Post: searchPost });
    } catch (error) {
      next(error);
    }
  };
  autoSearchPost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;

      const autoSearchPost = await this.postService.autoSearchPost(hashtag);

      res.status(200).json(autoSearchPost);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostController;
