const { Post } = require("../models");
const { Like } = require("../models");
const { Hashtag } = require("../models");
const Sequelize = require("sequelize");

const Op = Sequelize.Op;
var count = 0;
class PostRepository {
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
    console.log("유저아디", userId, typeof userId);
    const createPost = await Post.create({
      content,
      time,
      distance,
      path,
      speed,
      image,
      hashtag,
      userId,
    });
    return createPost;
  };
  getAllPosts = async (pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const getAllPosts = await Post.findAll({
      offset: offset,
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    return getAllPosts;
  };
  ////////////////////////////////////////
  getLikeAllPosts = async (pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const getLikeAllPosts = await Post.findAll({
      offset: count,
      limit: 5,
      order: [
        ["like", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return getLikeAllPosts;
  };
  getPost = async (postId) => {
    const getPost = await Post.findOne({ where: { postId } });

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
    const updatePost = await Post.update(
      { content, time, distance, path, speed, image, hashtag },
      { where: { postId } }
    );
    return updatePost;
  };
  deletePost = async (postId) => {
    const deletePost = await Post.destroy({ where: { postId } });

    return deletePost;
  };
  searchPost = async (hashtag1) => {
    const searchPost = await Post.findAll({
      where: {
        hashtag: {
          [Op.like]: `%${hashtag1}%`,
        },
      },
    });
    console.log("테스트", searchPost);
    return searchPost;
  };
  autoSearchPost = async (hashtag1) => {
    const autoSearchPost = await Hashtag.findAll({
      where: {
        hashtag: { [Op.like]: hashtag1 + "%" },
      },
    });
    const returnData = autoSearchPost.map((el) => el.hashtag);
    console.log(returnData);
    return returnData;
  };
}
module.exports = PostRepository;
