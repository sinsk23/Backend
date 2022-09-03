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

  getAllPosts = async (pagenum) => {
    const getAllPosts = await this.postRepository.getAllPosts(pagenum);
    console.log("렝뜨!!!!!!!!!!!!!!!!!!!!!", getAllPosts.length);
    for (let i = 0; i < getAllPosts.length; i++) {
      console.log("찍히냐?", i);
      return Promise.all(
        getAllPosts[i].map(async (post) => {
          const getPosts = await this.postRepository.getPost(post.postId);

          arry2.push(getPosts);
          return arry2;
        })
      );
    }
    console.log("너 왜 안찍히냐고", arry2);
    return arry2;
  };
  geLikeAllPosts = async (pagenum) => {
    const getLikeAllPosts = await this.postRepository.getLikeAllPosts(pagenum);

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
