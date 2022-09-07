const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { Hashtag } = require("../models");
const help = require("korean-regexp");
class UserRepository {
  addDistance = async (userId, distance) => {
    const addDistance = await Record.create({ userId, distance });
    return addDistance;
  };
  getUserPost = async (pagenum) => {
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
    N;
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

      const updateView = await Post.update(
        { view: countView.view + 1 },
        { where: { postId } }
      );
    }

    const getPost = await Post.findOne({ where: { postId } });

    return getPost;
  };

  searchUser = async (nickname) => {
    console.log("!!", nickname);
    nickname = help.explode(nickname).join("");
    console.log(nickname);
    const autoSearchPost = await User.findAll({
      where: {
        consonant: { [Op.like]: nickname + "%" },
      },
    });
    console.log("테스트!!", autoSearchPost);
    const returnData = autoSearchPost.map((el) => el.nickname);
    const test = await User.findAll({
      where: {
        nickname: { [Op.in]: returnData },
      },
      attributes: ["nickname", "profile"],
    });
    return test;
  };
  setGoal = async (goal, userId) => {
    const setGoal = await Record.create({ goal, userId });
    return setGoal;
  };
  changeProfile = async (profile, userId) => {
    const changeProfile = await User.update({ profile }, { where: { userId } });
    return changeProfile;
  };
}

module.exports = UserRepository;
