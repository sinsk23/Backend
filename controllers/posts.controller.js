const PostService = require("../services/posts.service");

class PostController {
  postService = new PostService();
  //클라이언트로부터 유저아이디,닉네임,내용,시간,거리,이미지,해쉬태그 등을 받아 postService.createPost로 넘겨주는 함수
  createPost = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { content, time, distance, path, image, hashtag } = req.body;

      const createPost = await this.postService.createPost(
        content,
        time,
        distance,
        path,
        image,
        hashtag,
        user.userId,
        user.nickname,
        user.image
      );

      res.status(201).json(createPost);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 유저아이디와 페이지넘버를 받아 postService.getAllPosts()함수로 유저아이디와 페이지넘버를 넘겨주는 함수
  getAllPosts = async (req, res, next) => {
    try {
      const { user } = res.locals;
      const { pagenum } = req.params;

      let type = false;
      const getAllPosts = await this.postService.getAllPosts(
        pagenum,
        user.userId
      );

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
  //클라이언트로부터 유저아이디와 포스트아이디를 받아 postService.getPost()함수로 유저아이디와 포스트아이디를 넘겨주는 함수
  getPost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { user } = res.locals;

      const getPost = await this.postService.getPost(postId, user.userId);

      if (!getPost) {
        return res.status(400).json({ result: false });
      }
      res.status(200).json(getPost);
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 포스트아이디와 업데이트할 column들을 받아 postService.updatePost()함수로 포스트아이디와 column들을 넘겨주는 함수
  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { content, time, distance, path, image, hashtag } = req.body;

      const updatePost = await this.postService.updatePost(
        postId,
        content,
        time,
        distance,
        path,
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
  //클라이언트로부터 포스트아이디를 받아 postService.deletePost()함수로 포스트아이디를 넘겨주는 함수
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
  //클라이언트로부터 유저아이디와 페이지넘버를 받아 postService.getLikeAllPosts()함수로 유저아이디와 페이지넘버를 넘겨주는 함수
  getLikeAllPosts = async (req, res, next) => {
    try {
      const { pagenum } = req.params;
      const { user } = res.locals;

      let type = false;
      const getLikeAllPosts = await this.postService.geLikeAllPosts(
        pagenum,
        user.userId
      );
      if (!getLikeAllPosts.length) {
        type = true;
      }
      res.status(200).json({ Post: getLikeAllPosts, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 해쉬태그와 페이지넘버를 받아 postService.searchPost()함수로 해쉬태그와 페이지넘버를 넘겨주는 함수
  searchPost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;
      const { pagenum } = req.params;
      let type = false;

      const searchPost = await this.postService.searchPost(hashtag, pagenum);
      if (!searchPost.length) {
        type = true;
      }
      res.status(200).json({ Post: searchPost, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 해쉬태그와 페이지넘버를 받아 postService.searchLikePost()함수로 해쉬태그와 페이지넘버를 넘겨주는 함수
  searchLikePost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;
      const { pagenum } = req.params;
      let type = false;

      const searchLikePost = await this.postService.searchLikePost(
        hashtag,
        pagenum
      );
      if (!searchLikePost.length) {
        type = true;
      }
      res.status(200).json({ Post: searchLikePost, isLast: type });
    } catch (error) {
      next(error);
    }
  };
  //클라이언트로부터 해쉬태그를 받아 postService.autoCompletePost()함수로 해쉬태그를 넘겨주는 함수
  autoCompletePost = async (req, res, next) => {
    try {
      const { hashtag } = req.query;

      const autoCompletePost = await this.postService.autoCompletePost(hashtag);

      res.status(200).json(autoCompletePost);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostController;
