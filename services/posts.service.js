const postRepository = require("../repositories/posts.repository");
let arry2 = [];
class PostService {
  postRepository = new postRepository();
  createPost = async (
    content,
    time,
    distance,
    path,
    speed,
    image,
    hashtag,
    userId
  ) => {
    const createPost = await this.postRepository.createPost(
      content,
      time,
      distance,
      path,
      speed,
      image,
      hashtag,
      userId
    );
    return createPost;
  };

  getAllPosts = async (pagenum, userId) => {
    const getAllPosts = await this.postRepository.getAllPosts(pagenum);

    return Promise.all(
      getAllPosts.map(async (post) => {
        const getPosts = await this.postRepository.getPost(post.postId, userId);

        return getPosts;
      })
    );
  };
  geLikeAllPosts = async (pagenum, userId) => {
    const getLikeAllPosts = await this.postRepository.getLikeAllPosts(pagenum);

    return Promise.all(
      getLikeAllPosts.map(async (post) => {
        const getPosts = await this.postRepository.getPost(post.postId, userId);

        return getPosts;
      })
    );
  };
  getPost = async (postId, userId) => {
    const getPost = await this.postRepository.getPost(postId, userId);

    return getPost;
  };
  updatePost = async (
    postId,
    content,
    time,
    distance,
    path,
    speed,
    image,
    hashtag,
    checkHash
  ) => {
    const updatePost = await this.postRepository.updatePost(
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
    return updatePost;
  };
  deletePost = async (postId) => {
    const deletePost = await this.postRepository.deletePost(postId);
    return deletePost;
  };
  searchPost = async (hashtag) => {
    const searchPost = await this.postRepository.searchPost(hashtag);
    return searchPost;
  };
  autoSearchPost = async (hashtag) => {
    const autoSearchPost = await this.postRepository.autoSearchPost(hashtag);
    return autoSearchPost;
  };
}
module.exports = PostService;
