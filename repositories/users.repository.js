const { Record, Post, Like, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
//const schedules = require("../node-scheduler");
//const scheduleService = new schedules();
const help = require("korean-regexp");
const day = require("../node-scheduler");
console.log("테스트123", day);
class UserRepositiory {
  addDistance = async (userId, distance, time) => {
    const getUserRecord = await Record.findOne({ where: { userId } });
    let percent = 0;
    let getDistance = Number(getUserRecord.distance + distance);
    percent = getDistance / 100;

    let weekOfDistance = getUserRecord.weekOfDistance;
    let weekOfTime = getUserRecord.weekOfTime;
    weekOfDistance[day.day] += distance;
    weekOfTime[day.day] += time;
    if (!getUserRecord) {
      const createdRecord = await Record.create({ userId, distance, time });
      return createdRecord;
    } else {
      const userDistance = getUserRecord.distance;
      const userTime = getUserRecord.time;
      const updatedRecord = await Record.update(
        {
          distance: distance + userDistance,
          percent: percent * 100,
          weekOfDistance: weekOfDistance,
          weekOfTime: weekOfTime,
          time: time + userTime,
        },
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
    const findId = await Post.findAll({ where: { userId } });
    let postIdArr = [];
    for (let i = 0; i < findId.length; i++) {
      postIdArr.push(findId[i].postId);
    }

    await Post.update(
      { profile: image },
      {
        where: {
          postId: { [Op.in]: postIdArr },
        },
      }
    );
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
      { attributes: ["distance", "goal", "percent", "array"] }
    );
    console.log("테스트", getUserInfo);
    return getUserInfo;
  };
  getRank = async () => {
    const getRank = await Record.findAll({
      limit: 5,
      order: [["distance", "DESC"]],
    });
    const userArr = [];
    for (let i = 0; i < getRank.length; i++) {
      userArr.push(getRank[i].userId);
    }

    const userInfo = await User.findAll({
      where: {
        userId: { [Op.in]: userArr },
      },
      attributes: ["nickname", "image"],
    });

    let i = -1;
    return getRank.map((test) => {
      i++;
      return {
        distance: test.distance,
        time: test.time,
        userId: test.userId,
        nickname: userInfo[i].nickname,
        profile: userInfo[i].image,
      };
    });
  };
}

module.exports = UserRepositiory;
