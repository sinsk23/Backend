const postRepository = require("../repositories/posts.repository");
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
  getAllPosts = async () => {
    const getAllPosts = await this.postRepository.getAllPosts();

    return Promise.all(
      getAllPosts.map(async (post) => {
        const getPosts = await this.postRepository.getPost(post.postId);

        return getPosts;
      })
    );
  };
  geLikeAllPosts = async () => {
    const getLikeAllPosts = await this.postRepository.getLikeAllPosts();

    return Promise.all(
      getLikeAllPosts.map(async (post) => {
        const getPosts = await this.postRepository.getPost(post.postId);

        return getPosts;
      })
    );
  };
  getPost = async (postId) => {
    const getPost = await this.postRepository.getPost(postId);

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
    hashtag
  ) => {
    const updatePost = await this.postRepository.updatePost(
      postId,
      content,
      time,
      distance,
      path,
      speed,
      image,
      hashtag
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
  autoSearchPost = async (hashtag1) => {
    const autoSearchPost = await this.postRepository.autoSearchPost(hashtag1);
    return autoSearchPost;
  };
}
module.exports = PostService;
