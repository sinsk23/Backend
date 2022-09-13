const { Post } = require("../models");
const { Like } = require("../models");
const { Hashtag } = require("../models");
const help = require("korean-regexp");
const Sequelize = require("sequelize");
const test = require("../node-mailer");
const Op = Sequelize.Op;

class PostRepository {
  emailService = new test();
  createPost = async (
    content,
    time,
    distance,
    path,
    speed,
    image,
    hashtag,
    userId,
    nickname
  ) => {
    const createPost = await Post.create({
      content,
      time,
      distance,
      path,
      speed,
      image,
      hashtag,
      userId,
      nickname,
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
    //this.emailService.realSend("rmadbstjd@naver.com");
    console.log("테스트", typeof getAllPosts);
    return getAllPosts;
  };
  ////////////////////////////////////////
  getLikeAllPosts = async (pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const getLikeAllPosts = await Post.findAll({
      offset: offset,
      limit: 5,
      order: [
        ["like", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    return getLikeAllPosts;
  };
  getPost = async (postId, userId) => {
    let isLike;
    if (userId) {
      isLike = await Like.findOne({ where: { userId, postId } });
      if (isLike) {
        await Post.update({ likeDone: true }, { where: { postId } });
      } else {
        await Post.update({ likeDone: false }, { where: { postId } });
      }
    } else {
      const countView = await Post.findOne({ where: { postId } });

      await Post.update({ view: countView.view + 1 }, { where: { postId } });
    }

    const getPost = await Post.findOne({
      where: { postId },
    });

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
    if (checkHash === false) {
      await Hashtag.destroy({ where: { postId } });
      const consonant = [];
      for (let i = 0; i < hashtag.length; i++) {
        consonant[i] = help.explode(hashtag[i]).join("");
        await Hashtag.create({
          hashtag: hashtag[i],
          consonant: consonant[i],
          postId: postId,
        });
      }
    }
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
  searchPost = async (hashtag, pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    let arrayId = [];

    const autoSearchPost = await Hashtag.findAll({
      where: {
        hashtag: { [Op.like]: hashtag + "%" },
      },
    });

    for (let i = 0; i < autoSearchPost.length; i++) {
      arrayId.push(autoSearchPost[i].postId);
    }

    const searchPost = await Post.findAll({
      offset: offset,
      limit: 5,
      order: [["createdAt", "DESC"]],
      where: {
        postId: { [Op.in]: arrayId },
      },
    });
    return searchPost;
  };
  searchLikePost = async (hashtag, pagenum) => {
    let offset = 0;
    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    let arrayId = [];

    const autoSearchPost = await Hashtag.findAll({
      where: {
        hashtag: { [Op.like]: hashtag + "%" },
      },
    });

    for (let i = 0; i < autoSearchPost.length; i++) {
      arrayId.push(autoSearchPost[i].postId);
    }

    const searchPost = await Post.findAll({
      offset: offset,
      limit: 5,
      order: [
        ["createdAt", "DESC"],
        ["like", "DESC"],
      ],
      where: {
        postId: { [Op.in]: arrayId },
      },
    });
    return searchPost;
  };
  autoSearchPost = async (hashtag) => {
    hashtag = help.explode(hashtag).join("");

    const autoSearchPost = await Hashtag.findAll({
      where: {
        consonant: { [Op.like]: hashtag + "%" },
      },
    });

    const returnData = autoSearchPost.map((el) => el.hashtag);
    const Data = [...new Set(returnData)];
    return Data;
  };
}
module.exports = PostRepository;
