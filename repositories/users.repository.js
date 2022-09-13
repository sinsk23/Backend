const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const help = require("korean-regexp");

class UserRepositiory {
  addDistance = async (userId, distance) => {
    const getUserRecord = await Record.findOne({ where: { userId } });
    console.log("추가distance", distance);
    console.log("현재distance", getUserRecord.distance);
    console.log("goal", getUserRecord.goal);
    let percent = 0;
    console.log(typeof percent);
    let getDistance = Number(getUserRecord.distance + distance);
    percent = getDistance / 100;

    console.log("퍼센트", percent);
    if (!getUserRecord) {
      const createdRecord = await Record.create({ userId, distance });
      return createdRecord;
    } else {
      const userDistance = getUserRecord.distance;
      const updatedRecord = await Record.update(
        { distance: distance + userDistance, percent: percent * 100 },
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

      await Post.update({ view: countView.view + 1 }, { where: { postId } });
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

    return checkNick;
  };
  signUp = async (email, nickname, image, provider, consonant) => {
    console.log("테스트", email, nickname, image, provider, consonant);
    const signUp = await User.create({
      email,
      nickname,
      consonant,
      provider,
      image,
    });
    console.log("왜안돼", signUp);
    return signUp;
  };
  deleteUser = async (userId) => {
    console.log("유저아디", userId);
    const deleteUser = await User.destroy({ where: { userId } });
    return deleteUser;
  };
  getUserInfo = async (userId) => {
    console.log("유저아이디", userId);
    const getUserInfo = await Record.findOne(
      { where: { userId } },
      { attributes: ["distance", "goal", "percent"] }
    );
    console.log("테스트", getUserInfo);
    return getUserInfo;
  };
}

module.exports = UserRepositiory;
