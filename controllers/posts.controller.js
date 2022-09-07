const PostService = require("../services/posts.service");
const { Hashtag } = require("../models");
const log = require("../config/logger");
const help = require("korean-regexp");
let BadRequestError = require("./http-errors").BadRequestError;
class PostController {
  postService = new PostService();

  createPost = async (req, res, next) => {
    try {
      const { content, time, distance, path, speed, image, hashtag, userId } =
        req.body;

      if (!content) {
        log.error("PostController.createPost : content is required");
        throw new BadRequestError(
          "PostController.createPost : content is required"
        );
      }

      const createPost = await this.postService.createPost(
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag,
        userId
      );

      if (hashtag) {
        let consonant = [];
        //유저가 Hashtag를 입력했을 때 Hashtag table에 Hashtag를 생성
        for (let i = 0; i < hashtag.length; i++) {
          consonant[i] = help.explode(hashtag[i]).join("");
          const createHashtag = await Hashtag.create({
            hashtag: hashtag[i],
            consonant: consonant[i],
            postId: createPost.postId,
          });
        }
      }
      res.status(201).json(createPost);
    } catch (error) {
      next(error);
    }
  };
  getAllPosts = async (req, res, next) => {
    try {
      const { pagenum } = req.params;
      const { userId } = req.body;
      if (!pagenum) {
        log.error("PostController.getAllPosts : pagenum is required");
        throw new BadRequestError(
          "PostController.getAllPosts : pagenum is required"
        );
      }
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
      if (!postId) {
        log.error("PostController.getPost : postId is required");
        throw new BadRequestError(
          "PostController.getPost : postId is required"
        );
      }
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
      if (!postId) {
        log.error("PostController.updatePost : postId is required");
        throw new BadRequestError(
          "PostController.updatePost : update is required"
        );
      }
      let arrayHash = [];
      let checkHash = false;
      const checkSameHashTag = await Hashtag.findAll({
        where: { postId },
        attributes: ["hashtag"],
      });

      //유저가 게시글을 수정할 때 hashtag를 수정하면 Hashtag 테이블의 hashtag도 같이 수정
      for (let i = 0; i < checkSameHashTag.length; i++) {
        arrayHash.push(checkSameHashTag[i].hashtag);
      }

      if (hashtag.join("") === arrayHash.join("")) {
        checkHash = true;
      } else {
        checkHash = false;
      }

      const updatePost = await this.postService.updatePost(
        postId,
        content,
        time,
        distance,
        path,
        speed,
        image,
        hashtag,
        checkHash
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
      if (!postId) {
        log.error("PostController.deletePost : postId is required");
        throw new BadRequestError(
          "PostController.deletePost : update is required"
        );
      }
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
      if (!pagenum) {
        log.error("PostController.getLikeAllPosts : pagenum is required");
        throw new BadRequestError(
          "PostController.getLikeAllPosts : pagenum is required"
        );
      }
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
      if (!hashtag) {
        log.error("PostController.searchPost : hashtag is required");
        throw new BadRequestError(
          "PostController.searchPost : hashtag is required"
        );
      }
      const searchPost = await this.postService.searchPost(hashtag);
      res.status(200).json({ Post: searchPost });
    } catch (error) {
      next(error);
    }
  };
  autoSearchPost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;
      if (!hashtag) {
        log.error("PostController.autoSearchPost : hashtag is required");
        throw new BadRequestError(
          "PostController.autoSearchPost : hashtag is required"
        );
      }
      const autoSearchPost = await this.postService.autoSearchPost(hashtag);

      res.status(200).json(autoSearchPost);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostController;
