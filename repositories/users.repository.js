const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const help = require("korean-regexp");

class UserRepositiory {
  addDistance = async (userId, distance) => {
    const getUserRecord = await Record.findOne({ where: { userId } });
    if (!getUserRecord) {
      const createdRecord = await Record.create({ userId, distance });
      return createdRecord;
    } else {
      const userDistance = getUserRecord.distance;
      const updatedRecord = await Record.update(
        { distance: distance + userDistance },
        { where: { userId } }
      );
      return updatedRecord;
    }
  };
  getUserPost = async (nickname, pagenum) => {
    let offset = 0;

    if (pagenum > 1) {
      offset = 5 * (pagenum - 1);
    }
    const getAllPosts = await Post.findAll({
      where: { nickname },
      offset: offset,
      limit: 5,
      order: [["createdAt", "DESC"]],
    });

    return getAllPosts;
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
    nickname = help.explode(nickname).join("");

    const autoSearchUser = await User.findAll({
      where: {
        consonant: { [Op.like]: nickname + "%" },
      },
    });

    const returnData = autoSearchUser.map((el) => el.nickname);
    const test = await User.findAll({
      where: {
        nickname: { [Op.in]: returnData },
      },
      attributes: ["nickname", "image"],
    });
    return test;
  };
  setGoal = async (goal, userId) => {
    const setGoal = await Record.create({ goal, userId });
    return setGoal;
  };
  changeImage = async (image, userId) => {
    const changeImage = await User.update({ image }, { where: { userId } });
    return changeImage;
  };
  checkNick = async (nickname) => {
    const checkNick = await User.findOne({ where: { nickname } });

    if (checkNick) {
      return "중복된 닉네임입니다.";
    } else {
      return "사용가능한 닉네임입니다.";
    }
  };
  signUp = async (email, nickname, image, consonant) => {
    const signUp = await User.create({ email, nickname, consonant, image });
    return signUp;
  };
}

module.exports = UserRepositiory;
